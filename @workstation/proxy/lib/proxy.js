const consola = require('consola')
const { createProxy } = require('http-proxy')
const AgentKeepAlive = require('agentkeepalive')

class Proxy {
  constructor(options) {
    // Options
    this.options = {
      proxyDefaults: {
        changeOrigin: true
      },
      ...options
    }

    // Create proxy
    this.proxy = createProxy({
      agent: this.options.agent || new AgentKeepAlive()
    })

    this.proxy.on('error', this._onProxyError.bind(this))

    // Dynamic proxy list (prefix => opts)
    this.rules = {}

    // Bind handleRequest to self
    this.handleRequest = this.handleRequest.bind(this)
  }

  setRules(rules) {
    this.rules = rules
    this._sortRules()
  }

  close() {
    if (this.__closed) {
      return
    }
    this.__closed = true

    this.proxy.close()
  }

  handleRequest(req, res) {
    // Try to match based on req.url
    const matchedRule = this._matchRule(req.url)

    // Skip if no matches
    if (!matchedRule) {
      res.statusCode = 404
      res.end('No proxy rules matched request: ' + req.url)
      return
    }

    // Remove prefix
    if (matchedRule.stripPrefix) {
      req.url = req.url.substr(matchedRule.prefix.length)
    }

    // Proxy HTTP
    this.proxy.web(req, res, matchedRule)
  }

  hookUpgrade(server) {
    server.on('upgrade', (req, socket, head) => {
      this.handleUpgrade(req, socket, head)
    })
  }

  handleUpgrade(req, sock, head) {
    // Try to match based on req.url
    const matchedRule = this._matchRule(req.url)

    // Skip if no matches or no ws enabled
    if (!matchedRule || !matchedRule.ws) {
      return
    }

    // Strip prefix
    if (matchedRule.stripPrefix) {
      req.url = req.url.substr(matchedRule.prefix.length)
    }

    // Proxy WebSocket
    this.proxy.ws(req, sock, head, matchedRule)
  }

  _onProxyError(error, req, res, options) {
    const errorMsg = 'Proxy error: ' + error.toString()

    if (error.code !== 'ECONNRESET') {
      consola.error(errorMsg)
    }

    if (res) {
      res.statusCode = 500
      res.end(errorMsg)
    }
  }

  _matchRule(url) {
    for (const prefix in this.rules) {
      if (url.indexOf(prefix) !== 0) {
        continue
      }
      let rule = this.rules[prefix]
      if (!rule) {
        return
      }
      if (typeof rule === 'function') {
        rule = rule()
      }
      if (!rule) {
        return
      }
      return rule
    }
  }

  _sortRules() {
    const rules = {}

    const sortedKeys = Object.keys(this.rules).sort((a, b) => b.length - a.length)
    for (const key of sortedKeys) {
      rules[key] = this.rules[key]
    }

    this.rules = rules
  }
}

module.exports = Proxy
