const runners = require('./runners')

module.exports = function getRunner(name) {
  let runner

  if (runners[name]) {
    runner = runners[name]()
  } else {
    runner = require.resolve(name)
  }

  return runner
}
