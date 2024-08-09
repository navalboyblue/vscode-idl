const http = require('http')
const https = require('https')
const enableDestroy = require('server-destroy')
const ip = require('ip')
const consola = require('consola')
const pify = require('pify')

class ProxyListener {
  constructor(handleRequest, { port = 8080, host = 'localhost', socket = false, https = false }) {
    // Request handler
    this.handleRequest = handleRequest

    // Options
    this.port = port
    this.host = host
    this.socket = socket
    this.https = https

    // After listen
    this.listening = false
    this.server = null
    this.address = null
    this.url = null
  }

  async close() {
    // Destroy server by forcing every connection to be closed
    if (this.server && this.server.listening) {
      await this.server.destroy()
      consola.debug('server closed')
    }

    // Delete references
    this.listening = false
    this.server = null
    this.address = null
    this.url = null
  }

  computeURL() {
    const address = this.server.address()

    if (this.socket) {
      this.url = `unix+http://${address}`
      return
    }

    switch (address.address) {
      case '127.0.0.1': this.host = 'localhost'; break
      case '0.0.0.0': this.host = ip.address(); break
    }

    this.port = address.port
    this.url = `http${this.https ? 's' : ''}://${this.host}:${this.port}`
  }

  async listen() {
    // Prevent multi calls
    if (this.listening) {
      return
    }

    // Initialize underlying http(s) server
    const protocol = this.https ? https : http
    const protocolOpts = typeof this.https === 'object' ? [this.https] : []
    this.server = protocol.createServer.apply(protocol, protocolOpts.concat(this.handleRequest))

    // Call server.listen
    // Prepare listenArgs
    const listenArgs = this.socket ? { path: this.socket } : { host: this.host, port: this.port }
    listenArgs.exclusive = false

    // Call server.listen
    try {
      await new Promise((resolve, reject) => {
        this.server.on('error', error => reject(error))
        this.server.listen(listenArgs, error => error ? reject(error) : resolve())
      })
    } catch (error) {
      return this._onServerError(error)
    }

    // Enable destroy support
    enableDestroy(this.server)
    pify(this.server.destroy)

    // Compute listen URL
    this.computeURL()

    // Set this.listening to true
    this.listening = true
  }

  _onServerError(error) {
    // Detect if port is not available
    const addressInUse = error.code === 'EADDRINUSE'

    // Use better error message
    if (addressInUse) {
      const address = this.socket || `${this.host}:${this.port}`
      error.message = `Address \`${address}\` is already in use.`

      // Listen to a random port on dev as a fallback
      if (this.dev && !this.socket && this.port !== '0') {
        consola.warn(error.message)
        consola.info('Trying a random port...')
        this.port = '0'
        return this.close().then(() => this.listen())
      }
    }

    // Throw error
    throw error
  }
}

module.exports = ProxyListener
