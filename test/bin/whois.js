
var t = require('assert')
var fs = require('fs')
var path = require('path')
var whois = require('../../bin/whois')
var render = require('../../lib/render')
var fixtures = {
  mikrotik: require('../fixtures/whois/mikrotik'),
  json: require('../fixtures/whois/json'),
  slack: require('../fixtures/whois/slack'),
  clean: fs.readFileSync(
    path.resolve(__dirname, '../fixtures/whois/clean'), 'utf8')
}


describe('varnalab', () => {
  describe('print', () => {
    it('json', () => {
      t.deepEqual(
        JSON.parse(whois.print(null, fixtures.mikrotik, 'json')).active,
        fixtures.json.active
      )
    })
    it('slack', () => {
      var output = JSON.parse(whois.print(null, fixtures.mikrotik, 'slack'))
      delete output.attachments[0].ts
      delete fixtures.slack.attachments[0].ts
      t.deepEqual(output, fixtures.slack)
    })
    it('clean', () => {
      var output = whois.print(null, fixtures.mikrotik, 'clean',
        render({output: 'clean'}))
      t.equal(output, fixtures.clean)
    })
  })
})
