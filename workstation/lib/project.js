const Application = require('./application')
const { mutex, mutexRelease, intersect, exclude, keyBy } = require('./utils')
const workstation = require('./workstation')

class Project {
  constructor(_workstation = workstation) {
    this.workstation = _workstation
    this.options = null

    this.applications = {} // name => application
  }

  async reload(options) {
    this.options = options
    await this.setupApplications()
  }

  async setupApplications() {
    if (!mutex(this, 'applications')) {
      return
    }
    try {
      const apps = keyBy(this.options.apps, 'name')

      const currentApps = new Set(Object.keys(this.applications))
      const newApps = new Set(Object.keys(apps))

      const appsToKeep = intersect(currentApps, newApps)
      const appsToAdd = exclude(newApps, appsToKeep)
      const appsToRemove = exclude(currentApps, appsToKeep)

      const queue = []

      queue.push(...[...appsToKeep].map(name => this.restartApplication(name, apps[name])))
      queue.push(...[...appsToAdd].map(name => this.addApplication(name, apps[name])))
      queue.push(...[...appsToRemove].map(name => this.removeApplication(name)))

      await Promise.all(queue)
    } finally {
      mutexRelease(this, 'applications')
    }
  }

  getApplication(name) {
    return this.applications[name]
  }

  async addApplication(name, options) {
    const application = new Application(this, options)
    this.applications[name] = application
    await this.workstation.callHook('application:add', application)
    await application.init()
  }

  async removeApplication(name) {
    const application = this.getApplication(name)
    await application.stop()
    await this.workstation.callHook('application:remove', application)
    delete this.applications[name]
  }

  async restartApplication(name, options) {
    const application = this.getApplication(name)
    await application.restart(options)
  }

  async stop() {
    if (!mutex(this, 'applications')) {
      return
    }
    try {
      await Promise.all(Object.values(this.applications).map((application) => {
        return application.stop()
      }))
      this.applications = {}
    } finally {
      mutexRelease(this, 'applications')
    }
  }
}

module.exports = Project
