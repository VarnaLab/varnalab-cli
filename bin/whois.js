#!/usr/bin/env node

const env = process.env.NODE_ENV || 'development'

var argv = require('minimist')(process.argv.slice(2))

var render = ((Table) => ((rows) => {
  var table = new Table({style: {head: ['green']}})
  rows.forEach((row) => table.push(row))
  return table.toString()
}))(require('cli-table'))

if (argv.help) {
  console.log(render([
    {'--help': 'Help message about `varnalab-whois`'},
    {'--config [file]': 'Specify config file - Required'},
    {'--json': 'JSON output'},
    {'--slack': 'Slack attachment output'},
    {'--timeout 5000': 'Timeout in milliseconds - defaults to 5000'}
  ]))
  process.exit()
}

if (!argv.config) {
  console.log('Specify --config [file]')
  process.exit()
}

var path = require('path')
var config = require(path.resolve(process.cwd(), argv.config))[env]

var MikroNode = require('mikronode')
var connection = MikroNode.getConnection(config.host, config.user, config.pass)
var async = require('async')


var router = {
  ondata: (done) => (router.done = done)
}

async.series({
  connection: (done) => {
    connection.connect((conn) => {
      chan = conn.openChannel()
      chan.on('done', (body) => router.done(null, MikroNode.parseItems(body)))
      chan.once('trap', (trap, chan) => router.done(trap))
      chan.once('error', (err, chan) => router.done(err))
      done(null, conn)
    })
  },
  leases: (done) => {
    chan.write('/ip/dhcp-server/lease/getall')
    router.ondata(done)
  },
  active: (done) => {
    chan.write('/ip/arp/getall')
    router.ondata(done)
  }
}, (err, result) => {
  clearTimeout(timeout)
  print(err, result)
  process.exit()
})

function print (err, result) {
  var timestamp = Math.floor(Date.now() / 1000)
  var error, active

  if (err) {
    error = err.message
  }
  else {
    var mac = result.active.map((lease) => lease['mac-address'])

    active = result.leases
      .filter((lease) => mac.indexOf(lease['mac-address']) !== -1)
      .map((lease) => ({
        mac: lease['mac-address'],
        ip: lease.address,
        host: lease['host-name']
      }))
  }

  if (argv.json) {
    console.log(JSON.stringify({timestamp, error, active}))
  }
  else if (argv.slack) {
    console.log(JSON.stringify({timestamp, error: 'Not implemented!'}))
  }
  else {
    console.log(render(error ? [{timestamp}, {error}] : [{timestamp}, {active}]))
  }
}

var timeout = setTimeout(() => {
  print(new Error('Timeout!'))
  process.exit()
}, argv.timeout || 5000)
