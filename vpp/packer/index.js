const vm_packer = require('./vm_packer.js')
const deps_packer = require('./deps_packer.js')
const compile = require('../compile')
const fs = require('fs')
//convert include_list to deps and files
function convert (include_list) {
    let deps = [], files = []
    for (let i of include_list) {
        files.push(i.file)
        deps.push(i.filePath)
    }
    return [deps, files]
}

function packer () {

}

module.exports = packer