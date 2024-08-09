#!/usr/bin/env node

const path = require('path')
const consola = require('consola')
const arg = require('arg')

async function main() {
  const argv = arg({
    '--port': Number,
    '--help': Boolean,

    '-p': '--port',
    '-h': '--help'
  })

  const [rootDir] = argv._

  if (!rootDir || argv['--help']) {
    return showHelp()
  }

  let config
  const configPath = path.resolve(rootDir, 'workstation.js')
  try {
    config = require(configPath)
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      consola.error(error)
    }
    consola.error(`Unable to load config from \`${configPath}\``)
    process.exit(1)
  }

  if (!config.rootDir) {
    config.rootDir = path.resolve(rootDir)
  }

  const { workstation, Project } = require('workstation')

  if (config.hooks) {
    workstation.addHooks(config.hooks)
  }

  const proxyOptions = config.proxy || {}
  if (argv.port) {
    proxyOptions.port = argv.port
  }
  if (Object.keys(proxyOptions).length) {
    const listener = await workstation.listen(proxyOptions)
    consola.success(`Listening on ${listener.url}`)
  }

  const project = new Project()
  await project.reload(config)
}

function showHelp() {
  console.log(`
    Usage: workstation [options] <rootDir>

    Options:
      -p, --port:   Enable proxy on this port
      -h, --help    Show this help message
  `)
}

main().catch((error) => {
  consola.fatal(error)
})
