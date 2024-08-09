const path = require('path')
const { Worker } = require('worker_threads')
const BaseRunner = require('./base')

class ThreadRunner extends BaseRunner {
  get name() {
    return 'thread'
  }

  get id() {
    return this.thread ? this.thread.threadId : -1
  }

  start() {
    // Start thread
    this.thread = new Worker(
      path.resolve(this.options.rootDir, this.options.worker),
      {
        workerData: {
          isTTY: process.stdout.isTTY,
          ...this.options
        }
      }
    )
    const onlinePromise = new Promise((resolve) => {
      this.thread.once('online', resolve)
    })

    // Setup listeners
    this.thread.on('message', (message) => {
      if (!message || !message.type) {
        return
      }
      this.emit('message', message.type, message.payload)
      if (message.type === '_close') {
        this.stop().then(() => {
          this._onClose()
        }).catch((error) => {
          console.error('[Thread]', error)
        })
      }
    })

    this.thread.on('close', (code) => {
      this._onClose(code)
    })

    // Update status
    this.status = 'STARTED'

    return onlinePromise
  }

  stop() {
    if (!this.thread) {
      return
    }
    return new Promise((resolve, reject) => {
      this.thread.terminate((error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }

  send(type, payload) {
    if (!this.thread) {
      return
    }
    this.thread.postMessage({
      type,
      payload
    })
  }

  _onClose(code) {
    // Unref
    this.thread.unref()
    delete this.thread

    // Update status
    this.status = 'CLOSED'

    // Emit close event
    this.emit('close', code)
  }
}

module.exports = ThreadRunner
