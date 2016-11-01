
var t = require('assert')
var fs = require('fs')
var path = require('path')
var os = require('os')
var cp = require('child_process')

var fpath = path.resolve(os.homedir(), '.varnalab-cli')

var spawn = ((index) => (args, env) => {
  var fpath = path.resolve(__dirname, '../utils/render.js')
  var dpath = path.resolve(__dirname, '../../coverage/render' + index++)
  return cp.spawn('istanbul', ['cover', '--dir', dpath, fpath]
    .concat(args ? ['--'].concat(args) : []),
    {env: process.env}
  )
})(0)


describe('render', () => {
  var render

  describe('coverage', () => {
    before(() => {
      render = spawn()
    })

    it('dummy', (done) => {
      render.stdout.once('data', () => done())
    })

    after((done) => setTimeout(() => {
      render.kill()
      done()
    }, 100))
  })
})
