class Vpp {
    constructor () {
        this.__oldData__ = Object.create(null)
    }

    __didLoad__ () {

    }

    __didUnload__ () {

    }

    __update__ () {
        this.__v__.update()
    }

    update () {
        this.__update__()
    }
}