const ProxyListener = require('./listener')

class ProxyServer {
  constructor(proxy) {
    this.proxy = proxy
    this.listeners = []
  }

  async listen(listenOptions) {
    // Create a new listener
    const listener = new ProxyListener(this.proxy.handleRequest, listenOptions)

    // Listen
    await listener.listen()

    // Hook upgrade
    this.proxy.hookUpgrade(listener.server)

    // Push listener to this.listeners
    this.listeners.push(listener)

    return listener
  }

  async close() {
    if (this.__closed) {
      return
    }
    this.__closed = true

    for (const listener in this.listeners) {
      await listener.close()
    }
    this.listeners = []
  }
}

module.exports = ProxyServer
