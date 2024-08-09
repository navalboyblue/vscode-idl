//output directory
const directory = 'vpp_cache'

//vpp version
const version = require('./package.json').version

//compile options
const production = require('process').env.NODE_ENV == 'production'