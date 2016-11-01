#!/usr/bin/env node

var args = require('../lib/config')()
var render = require('../lib/render')(args)

if (args.help) {
  console.log(render(['Flag', 'Description'], [
    {'--help': 'Help message about `varnalab-whois`'},
    {'--config [file]': 'Specify config file - Required'},
    {'--output [json|output|clean]': 'JSON / Slack attachment output / ' +
      'Clean output without UTF8 tables'},
    {'--timeout 5000': 'Timeout in milliseconds - defaults to 5000'}
  ]))
  process.exit()
}

if (!args.config) {
  console.error('Error: Specify --config [file]')
  process.exit()
}

var MikroNode = require('mikronode')
var connection = MikroNode.getConnection(
  args.config.host, args.config.user, args.config.pass)
var async = require('async')


var chan
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

  if (args.output === 'json') {
    console.log(JSON.stringify({timestamp, error, active}))
  }
  else if (args.output === 'slack') {
    console.log(JSON.stringify({timestamp, error: 'Not implemented!'}))
  }
  else {
    error
      ? console.error('Error:', error)
      : console.log(render(['mac', 'ip', 'host'],
          active.map((lease) => ([lease.mac, lease.ip, lease.host]))
        ))
  }
}

var timeout = setTimeout(() => {
  print(new Error('Timeout!'))
  process.exit()
}, args.timeout || 5000)
