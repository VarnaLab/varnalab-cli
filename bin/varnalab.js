#!/usr/bin/env node

const env = process.env.NODE_ENV || 'development'

var argv = require('minimist')(process.argv.slice(2))

var render = ((Table) => ((rows) => {
  var table = new Table({style: {head: ['green']}})
  rows.forEach((row) => table.push(row))
  return table.toString()
}))(require('cli-table'))

var fs = require('fs')
var path = require('path')

var commands = fs.readdirSync(path.resolve(__dirname))
  .map((cmd) => cmd.replace('.js', ''))
commands.splice(commands.indexOf('varnalab'), 1)

if (!argv._.length && argv.help) {
  console.log(render([
    {'--help': 'Help message about `varnalab`'},
    {'[command] [arguments]': 'Execute command with arguments'},
    {'Available commands': commands.join(', ')}
  ]))
  process.exit()
}

if (!argv._.length) {
  console.log('Specify [command] [arguments] to execute')
  process.exit()
}

var command = argv._[0]

var match = commands.filter((cmd) => (cmd === command))
if (!match.length) {
  console.log(render([{'Available commands are: ': commands.join(', ')}]))
  process.exit()
}

var cp = require('child_process')
var params = process.argv.slice(3).concat(['--color'])
var cmd = cp.spawn('varnalab-' + command, params)

cmd.stderr.pipe(process.stderr)
cmd.stdout.pipe(process.stdout)
