#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    --config    /path/to/config.json
    --env       environment
    --output    [json|table|clean] - defaults to table, clean = no UTF8 table
    --timeout   timeout in milliseconds - defaults to 5000
  `)
  process.exit()
}

if (!argv.config) {
  console.error('Specify --config /path/to/config.json')
  process.exit()
}

var api = require('../whois/api')
var table = require('../whois/table')

var print = ({active, error, output}) => {
  var timestamp = Math.floor(Date.now() / 1000)

  if (active) {
    return output === 'json'
      ? JSON.stringify({timestamp, active})
      : table.render({
          head: ['mac', 'ip', 'host'],
          rows: active.map((lease) => [lease.mac, lease.ip, lease.host]),
          output
        })
  }
  else if (error) {
    return output === 'json'
      ? JSON.stringify({timestamp, error: error.message || error})
      : error
  }
}

;(async () => {

  try {
    var active = await api.whois(require(argv.config)[argv.env])
    console.log(print({active, output: argv.output}))
  }
  catch (error) {
    console.error(print({error, output: argv.output}))
  }
  finally {
    process.exit()
  }

  var timeout = setTimeout(() => {
    print({error: new Error('Timeout!'), output: argv.output})
    process.exit()
  }, argv.timeout || 5000)

})()
