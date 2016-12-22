
const env = process.env.NODE_ENV || 'development'

var fs = require('fs')
var path = require('path')
var extend = require('extend')
var dotfile = require('./dotfile')


function mikrotik (argv) {
  var config

  if (!argv.config) {
    return config
  }

  if (typeof argv.config !== 'string') {
    throw new Error('Error: Specify config file')
  }

  var fpath = path.resolve(process.cwd(), argv.config)

  if (!fs.existsSync(fpath)) {
    throw new Error('Error: Non existing config file')
  }

  try {
    config = require(fpath)
  }
  catch (err) {
    throw new Error('Error: Config file ' + err.message)
  }

  if (!config[argv.env || env]) {
    throw new Error('Error: Non existing environment in config file')
  }

  return config ? config[argv.env || env] : config
}

module.exports = (argv) => {
  argv = argv || {}
  var args = {}
  extend(true, args, dotfile(), argv, {config: mikrotik(argv)})
  return args
}
