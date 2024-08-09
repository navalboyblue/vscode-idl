class Service {
  constructor(name) {
    this.name = name

    this.providers = []
    this.providerCtr = -1
  }

  register(runner, service) {
    this.providers.push({ runner, service })
  }

  unregister(runner) {
    this.providers = this.providers.filter(p => p.runner !== runner)
  }

  getProvider() {
    if (!this.providers.length) {
      return
    }

    this.providerCtr++
    if (this.providerCtr >= this.providers.length) {
      this.providerCtr = 0
    }

    return this.providers[this.providerCtr]
  }
}

module.exports = Service
