const { NotImplement } = require('../def.js')
class Type {
    serialize () { throw NotImplement }
}

class TString extends Type {
    constructor (str) {
        super()
        this.str = str
    }

    serialize () {
        return JSON.stringify(this.str)
    }
}

class TNumber extends Type {
    constructor (value) {
        super()
        this.value = value
    }

    serialize () {
        return this.value
    }
}

class TVariable extends Type {
    constructor (name) {
        super()
        this.name = name
    }

    serialize () {
        return 'this.get("' + this.name + '")'
    }
}

module.exports = {TString, TNumber, TVariable}