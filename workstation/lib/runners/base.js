const EventEmitter = require('events')

class BaseRunner extends EventEmitter {
  constructor(options = {}) {
    super()

    if (!options.bridge) {
      options.bridge = this.name
    }

    this.options = options

    this._status = 'CREATED'
  }

  get name() {
    return 'base'
  }

  set status(_status) {
    this._status = _status
    this.emit('update')
  }

  get status() {
    return this._status
  }

  // -- Abstracts --
  get id() {}
  start() {}
  stop() {}
  send() {}
}

module.exports = BaseRunner
