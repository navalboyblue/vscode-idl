const { cpus } = require('os')
const CPU_COUNT = cpus().length

module.exports = {
  CPU_COUNT
}
