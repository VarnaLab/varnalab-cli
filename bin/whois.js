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
var output = require('../whois/output')

;(async () => {

  var timeout = setTimeout(() => {
    console.error(output({error: new Error('Timeout!'), output: argv.output}))
    process.exit()
  }, argv.timeout || 5000)

  try {
    var active = await api.whois(require(argv.config)[argv.env])
    console.log(output({active, output: argv.output}))
  }
  catch (error) {
    console.error(output({error, output: argv.output}))
  }
  finally {
    process.exit()
  }

})()
