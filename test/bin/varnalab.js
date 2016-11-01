
var t = require('assert')
var fs = require('fs')
var path = require('path')
var os = require('os')
var cp = require('child_process')

var fpath = path.resolve(os.homedir(), '.varnalab-cli')

var spawn = ((index) => (args, env) => {
  var fpath = path.resolve(__dirname, '../utils/varnalab.js')
  var dpath = path.resolve(__dirname, '../../coverage/varnalab' + index++)
  return cp.spawn('istanbul', ['cover', '--dir', dpath, fpath]
    .concat(args ? ['--'].concat(args) : []),
    {env: process.env}
  )
})(0)


describe('varnalab', () => {
  var varnalab

  describe('coverage', () => {
    before(() => {
      varnalab = spawn()
    })

    it('dummy', (done) => {
      varnalab.stdout.once('data', () => done())
    })

    after((done) => setTimeout(() => {
      varnalab.kill()
      done()
    }, 100))
  })
})