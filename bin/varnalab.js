#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

try {
  var args = require('../lib/config')(argv)
}
catch (err) {
  console.error(err)
  process.exit()
}
var render = require('../lib/render')(args)

var fs = require('fs')
var path = require('path')

var commands = fs.readdirSync(path.resolve(__dirname))
  .map((cmd) => cmd.replace('.js', ''))
commands.splice(commands.indexOf('varnalab'), 1)

if (!args._.length && args.help) {
  console.log(render(['Flag', 'Description'], [
    {'--help': 'Help message about `varnalab`'},
    {'[command] [arguments]': 'Execute command with arguments - ' +
      commands.join(', ')}
  ]))
  process.exit()
}

if (!args._.length) {
  console.error('Error: Specify [command] [arguments] to execute')
  process.exit()
}

var command = args._[0]

var match = commands.filter((cmd) => (cmd === command))
if (!match.length) {
  console.error('Error: Available commands are:', commands.join(', '))
  process.exit()
}

var cp = require('child_process')
var params = process.argv.slice(3).concat(['--color'])
var cmd = cp.spawn('varnalab-' + command, params)

cmd.stderr.pipe(process.stderr)
cmd.stdout.pipe(process.stdout)
