const BaseRunner = require('./runners/base')
const workstation = require('./workstation')
const Project = require('./project')

module.exports = {
  workstation,
  Workstation: workstation.Workstation,
  BaseRunner,
  Project
}
