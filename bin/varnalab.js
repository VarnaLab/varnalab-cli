#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (!argv._.length && argv.help) {
  console.log(`
    [command] [arguments]     execute command with arguments
                              for example: whois --config /path/to/config.json
  `)
  process.exit()
}

if (!argv._.length) {
  console.log('Specify [command] [arguments] to execute')
  process.exit()
}

var commands = ['whois']
var command = argv._[0]

if (!commands.includes(command)) {
  console.log('Available commands are:', commands.join(', '))
  process.exit()
}

var path = require('path')
var cp = require('child_process')

var cmd = cp.spawn('node', [
  `${path.join(__dirname, command)}.js`,
  ...process.argv.slice(3),
  '--color'
])

cmd.stderr.pipe(process.stderr)
cmd.stdout.pipe(process.stdout)
