const path = require('path')
const { fork } = require('child_process')
const BaseRunner = require('./base')

class ProcessRunner extends BaseRunner {
  get name() {
    return 'process'
  }

  get id() {
    return this.process ? this.process.pid : -1
  }

  start() {
    // Fork process
    this.process = fork(
      path.resolve(this.options.rootDir, this.options.worker),
      [JSON.stringify(this.options)],
      { stdout: process.stdout, stderr: process.stderr }
    )

    // Setup listeners
    this.process.on('message', (msg) => {
      if (msg && msg.type) {
        this.emit('message', msg.type, msg.payload)
      }
    })

    this.process.on('exit', (code) => {
      this._onExit(code)
    })

    // Update status
    this.status = 'STARTED'

    return Promise.resolve()
  }

  stop() {
    if (!this.process) {
      return
    }
    this.process.kill('SIGTERM')
    return Promise.resolve()
  }

  send(type, payload) {
    if (!this.process) {
      return
    }
    this.process.send({
      type,
      payload
    })
  }

  _onExit(code) {
    // Unref
    delete this.process

    // Update status
    this.status = 'CLOSED'

    // Emit close event
    this.emit('close', code)
  }
}

module.exports = ProcessRunner
