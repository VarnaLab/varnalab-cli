
var t = require('assert')
var fs = require('fs')
var path = require('path')
var os = require('os')
var cp = require('child_process')

var fpath = path.resolve(os.homedir(), '.varnalab-cli')

var spawn = ((index) => (args, env) => {
  var fpath = path.resolve(__dirname, '../utils/config.js')
  var dpath = path.resolve(__dirname, '../../coverage/config' + index++)
  return cp.spawn('istanbul', ['cover', '--dir', dpath, fpath]
    .concat(args ? ['--'].concat(args) : []),
    {env: process.env}
  )
})(0)


describe('config', () => {
  var config

  describe('dotfile - error', () => {
    before(() => {
      fs.writeFileSync(fpath, '"output": "json",\n"timeout": 1000')
      config = spawn()
    })

    it('JSON parse error', (done) => {
      config.stderr.once('data', (data) => {
        t.ok(/Error: \.varnalab-cli Unexpected token :/.test(data.toString()))
        done()
      })
    })

    after((done) => setTimeout(() => {
      fs.unlinkSync(fpath)
      config.kill()
      done()
    }, 100))
  })

  describe('dotfile - arguments', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify({output: 'json'}))
      config = spawn()
    })

    it('set output type', (done) => {
      config.stdout.once('data', (data) => {
        t.deepEqual(JSON.parse(data.toString()), {output: 'json', _: []})
        done()
      })
    })

    after((done) => setTimeout(() => {
      fs.unlinkSync(fpath)
      config.kill()
      done()
    }, 100))
  })

  describe('dotfile - config', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify(
        {config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}}))
      config = spawn()
    })

    it('non existing environment', (done) => {
      config.stdout.once('data', (data) => {
        t.deepEqual(JSON.parse(data.toString()), {
          config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}, _: []})
        done()
      })
    })

    after((done) => setTimeout(() => {
      fs.unlinkSync(fpath)
      config.kill()
      done()
    }, 100))
  })

  describe('mikrotik - missing config path', () => {
    before(() => {
      config = spawn(['--config'])
    })

    it('config path is not a string', (done) => {
      config.stderr.once('data', (data) => {
        t.equal(data.toString(), 'Error: Specify config file\n')
        done()
      })
    })

    after((done) => setTimeout(() => {
      config.kill()
      done()
    }, 100))
  })

  describe('mikrotik - incorrect config path', () => {
    before(() => {
      config = spawn(['--config', 'some/path.json'])
    })

    it('non existing config file', (done) => {
      config.stderr.once('data', (data) => {
        t.equal(data.toString(), 'Error: Non existing config file\n')
        done()
      })
    })

    after((done) => setTimeout(() => {
      config.kill()
      done()
    }, 100))
  })

  describe('mikrotik - JSON error', () => {
    before(() => {
      config = spawn(['--config',
        path.resolve(__dirname, '../fixture/mikrotik-error.json')])
    })

    it('JSON parse error', (done) => {
      config.stderr.once('data', (data) => {
        t.ok(/Error: .* Unexpected token :/
          .test(data.toString()))
        done()
      })
    })

    after((done) => setTimeout(() => {
      config.kill()
      done()
    }, 100))
  })

  describe('mikrotik - environment error', () => {
    before(() => {
      config = spawn(['--config',
        path.resolve(__dirname, '../fixture/mikrotik.json')],
        {NODE_ENV: 'mikrotik'})
    })

    it('non existing environment', (done) => {
      config.stderr.once('data', (data) => {
        t.equal(data.toString(), 'Error: Non existing environment in config file\n')
        done()
      })
    })

    after((done) => setTimeout(() => {
      config.kill()
      done()
    }, 100))
  })

  describe('mikrotik - success', () => {
    before(() => {
      process.env.NODE_ENV = 'staging'
      config = spawn(['--config',
        path.resolve(__dirname, '../fixture/mikrotik.json')])
    })

    it('load config', (done) => {
      config.stdout.once('data', (data) => {
        t.deepEqual(JSON.parse(data.toString()), {_: [],
          config: {host: 's1', user: 's2', pass: 's3', port: 2}})
        done()
      })
    })

    after((done) => setTimeout(() => {
      delete process.env.NODE_ENV
      config.kill()
      done()
    }, 100))
  })

  describe('override - dotfile - arguments', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify({output: 'json'}))
      config = spawn(['--output', 'slack'])
    })

    it('non existing environment', (done) => {
      config.stdout.once('data', (data) => {
        t.deepEqual(JSON.parse(data.toString()), {output: 'slack', _: []})
        done()
      })
    })

    after((done) => setTimeout(() => {
      fs.unlinkSync(fpath)
      config.kill()
      done()
    }, 100))
  })

  describe('override - dotfile - config', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify(
        {config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}}))
      process.env.NODE_ENV = 'staging'
      config = spawn(['--config',
        path.resolve(__dirname, '../fixture/mikrotik.json')])
    })

    it('non existing environment', (done) => {
      config.stdout.once('data', (data) => {
        t.deepEqual(JSON.parse(data.toString()), {
          config: {host: 's1', user: 's2', pass: 's3', port: 2}, _: []})
        done()
      })
    })

    after((done) => setTimeout(() => {
      fs.unlinkSync(fpath)
      delete process.env.NODE_ENV
      config.kill()
      done()
    }, 100))
  })
})
