const Hookable = require('hable')
const { Proxy, ProxyServer } = require('@workstation/proxy')
const Service = require('./service')
const getRunner = require('./get-runner')

class Workstation extends Hookable {
  constructor() {
    super()

    this._runners = []
    this._subscribers = {} // type => [runners]

    this._messageHandlers = {
      _error: this._handleError.bind(this),
      _subscribe: this._handleSubscribe.bind(this),
      _registerService: this._handleRegisterService.bind(this)
    }

    this.services = {}

    this.proxy = null
    this.proxyServer = null
  }

  async start(options = {}, runner = 'process') {
    if (typeof runner === 'string') {
      const Runner = getRunner(runner)
      runner = new Runner(options)
    }

    await this.register(runner)
    await runner.start()
    await this.callHook('runner:start', runner)
    return runner
  }

  async stop(runner) {
    this.unregister(runner)
    await this.callHook('runner:stop', runner)
    await runner.stop()
  }

  async register(runner) {
    this._runners.push(runner)

    runner.on('update', () => {
      this.callHook('runner:update', runner)
    })

    runner.on('close', () => {
      this.unregister(runner)
    })

    runner.on('message', (type, payload) => {
      this.callHook('runner:message:' + type, runner, payload)
      this._handleMessage(runner, type, payload)
    })

    await this.callHook('runner:register', runner)
  }

  async unregister(runner) {
    await this.callHook('runner:unregister', runner)

    this._runners = this._runners.filter(r => r !== runner)

    for (const service of Object.values(this.services)) {
      service.providers = service.providers.filter(s => s.runner !== runner)
    }
  }

  getService(name) {
    if (!this.services[name]) {
      this.services[name] = new Service(name)
    }
    return this.services[name]
  }

  sendTo(serviceName, type, payload) {
    const service = this.getService(serviceName)
    const provider = service.getProvider()

    if (!provider) {
      throw new Error('No provider for service ' + serviceName)
    }

    return provider.runner.send(type, payload)
  }

  async listen(listenOptions) {
    this._initProxy()
    const listener = await this.proxyServer.listen(listenOptions)
    return listener
  }

  _initProxy() {
    if (!this.proxy) {
      this.proxy = new Proxy()
      this.proxyServer = new ProxyServer(this.proxy)

      this._updateProxy()

      this.hook('runner:service', () => { this._updateProxy() })
      this.hook('runner:unregister', () => { this._updateProxy() })
    }
  }

  _updateProxy() {
    if (!this.proxy) {
      return
    }

    const rules = {}

    for (const service of Object.values(this.services)) {
      const provider0 = service.getProvider()
      if (!provider0 || !provider0.service.prefix) {
        continue
      }
      const { prefix } = provider0.service

      if (prefix in rules) {
        throw new Error('Proxy conflict for prefix ' + prefix)
      }

      rules[prefix] = () => {
        const provider = service.getProvider()
        if (!provider) {
          return
        }
        return {
          ...provider.service,
          prefix,
          target: provider.service.url
        }
      }
    }

    this.proxy.setRules(rules)
  }

  _handleMessage(runner, type, payload) {
    // Check for internal handlers
    if (type[0] === '_') {
      const handlerFn = this._messageHandlers[type]
      if (handlerFn) {
        handlerFn(runner, payload)
      }
    }

    // Send message to subscribers
    const sendTo = this._subscribers[type] || []
    for (const runner of sendTo) {
      runner.send(type, payload)
    }
  }

  _handleError(runner, payload) {
    console.error(`Error from ${runner.id}:`, payload.message)
  }

  _handleSubscribe(runner, payload) {
    if (!this._subscribers[payload]) {
      this._subscribers[payload] = []
    }
    if (!this._subscribers[payload].includes(runner)) {
      this._subscribers[payload].push(runner)
    }
  }

  _handleRegisterService(runner, service) {
    this.getService(service.name).register(runner, service)
    this.callHook('runner:service', runner, service)
  }
}

const instance = new Workstation()
instance.Workstation = Workstation

module.exports = instance
