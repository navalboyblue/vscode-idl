const consola = require('consola')
const { mutex, mutexRelease, range } = require('./utils')
const { CPU_COUNT } = require('./consts')

class Application {
  constructor(project, options = {}) {
    this.project = project
    this.options = options

    this.instances = [] // Array of Runner
  }

  get desiredInstances() {
    let instances

    if (this.options.instances === 'max') {
      instances = CPU_COUNT
    } else {
      instances = parseInt(this.options.instances) || 1
    }

    return instances
  }

  get rootDir() {
    return this.options.rootDir || this.project.options.rootDir || process.cwd()
  }

  async init() {
    if (this._init) {
      return
    }
    this.init = true

    await this.setupInstances()

    if (this.options.watch) {
      this.startWatch()
    }
  }

  async setupInstances(desiredInstances = this.desiredInstances) {
    if (!mutex(this, 'instances')) {
      return
    }
    try {
      if (desiredInstances > this.instances.length) {
        // Start more instances
        const newInstances = await Promise.all(range(desiredInstances - this.instances.length).map(async () => {
          const runner = await this.project.workstation.start({
            ...this.options,
            rootDir: this.rootDir
          }, this.options.runner)

          runner.on('close', () => {
            this.instances = this.instances.filter(r => r !== runner)
            // TODO: Implement restartStrategy support
          })

          return runner
        }))

        this.instances.push(...newInstances)
      } else if (desiredInstances < this.instances.length) {
        // Remove extra instances
        const extraInstances = this.instances
        this.instances = extraInstances.splice(0, desiredInstances)
        await Promise.all(extraInstances.map((instance) => {
          return this.project.workstation.stop(instance)
        }))
      }
    } finally {
      mutexRelease(this, 'instances')
    }
  }

  async stop() {
    await this.setupInstances(0)
    if (this.watcher) {
      this.watcher.close()
      delete this.watcher
    }
  }

  async restart(options) {
    await this.setupInstances(0)

    if (options) {
      this.options = options
    }

    await this.setupInstances()

    consola.success(`Restarted \`${this.options.name}\``)
  }

  startWatch() {
    const chokidar = require('chokidar')

    const watchOptions = {
      persistent: true,
      ignoreInitial: true,
      files: this.rootDir,
      ...this.options.watch
    }

    this.watcher = chokidar.watch(watchOptions.files, watchOptions).on('all', async ({ event, path }) => {
      await this.restart()
    })
  }
}

module.exports = Application
