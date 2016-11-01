
const env = process.env.NODE_ENV || 'development'

var argv = require('minimist')(process.argv.slice(2))

var os = require('os')
var fs = require('fs')
var path = require('path')
var extend = require('extend')


function dotfile () {
  var config
  var dotfile = path.resolve(os.homedir(), '.varnalab-cli')

  if (fs.existsSync(dotfile)) {
    try {
      config = JSON.parse(fs.readFileSync(dotfile))
    }
    catch (err) {
      console.error('Error:', '.varnalab-cli', err.message)
      process.exit()
    }
  }

  return config
}

function mikrotik () {
  var config

  if (!argv.config) {
    return config
  }

  if (typeof argv.config !== 'string') {
    console.error('Error:', 'Specify config file')
    process.exit()
  }

  var fpath = path.resolve(process.cwd(), argv.config)

  if (!fs.existsSync(fpath)) {
    console.error('Error:', 'Non existing config file')
    process.exit()
  }

  try {
    config = require(fpath)
  }
  catch (err) {
    console.error('Error:', 'Config file', err.message)
    process.exit()
  }

  if (!config[env]) {
    console.error('Error:', 'Non existing environment in config file')
    process.exit()
  }

  return config ? config[env] : config
}

module.exports = () => {
  var args = {}
  extend(true, args, dotfile(), argv, {config: mikrotik()})
  return args
}
