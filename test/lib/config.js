
var t = require('assert')
var fs = require('fs')
var path = require('path')
var os = require('os')

var config = require('../../lib/config')
var fpath = path.resolve(os.homedir(), '.varnalab-cli')


describe('config', () => {

  describe('dotfile - error', () => {
    before(() => {
      fs.writeFileSync(fpath, '"output": "json",\n"timeout": 1000')
    })

    it('JSON parse error', () => {
      t.throws(() => config(), /Error: \.varnalab-cli Unexpected token :/)
    })

    after(() => fs.unlinkSync(fpath))
  })

  describe('dotfile - arguments', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify({output: 'json'}))
    })

    it('set output type', () => {
      t.deepEqual(config(), {output: 'json'})
    })

    after(() => fs.unlinkSync(fpath))
  })

  describe('dotfile - config', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify(
        {config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}}))
    })

    it('non existing environment', () => {
      t.deepEqual(config(), {
        config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}})
    })

    after(() => fs.unlinkSync(fpath))
  })

  describe('mikrotik - missing config path', () => {
    it('config path is not a string', () => {
      t.throws(() => config({config: true}), /Error: Specify config file/)
    })
  })

  describe('mikrotik - incorrect config path', () => {
    it('non existing config file', () => {
      t.throws(() => config({config: 'some/path.json'}), /Error: Non existing config file/)
    })
  })

  describe('mikrotik - JSON error', () => {
    it('JSON parse error', () => {
      t.throws(() => config({
        config: path.resolve(__dirname, '../fixtures/mikrotik-error.json')}),
        /Error: .* Unexpected token :/)
    })
  })

  describe('mikrotik - environment error', () => {
    it('non existing environment', () => {
      t.throws(() => config({
        config: path.resolve(__dirname, '../fixtures/mikrotik.json')}),
        /Error: Non existing environment in config file/)
    })
  })

  describe('mikrotik - success', () => {
    it('load config', () => {
      t.deepEqual(config({
        config: path.resolve(__dirname, '../fixtures/mikrotik.json'),
        env: 'staging'
      }), {
        config: {host: 's1', user: 's2', pass: 's3', port: 2},
        env: 'staging'
      })
    })
  })

  describe('override - dotfile - arguments', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify({output: 'json'}))
    })

    it('non existing environment', () => {
      t.deepEqual(config({output: 'slack'}), {output: 'slack'})
    })

    after(() => fs.unlinkSync(fpath))
  })

  describe('override - dotfile - config', () => {
    before(() => {
      fs.writeFileSync(fpath, JSON.stringify(
        {config: {host: 'c1', user: 'c2', pass: 'c3', port: 1}}))
    })

    it('non existing environment', () => {
      t.deepEqual(config({
        config: path.resolve(__dirname, '../fixtures/mikrotik.json'),
        env: 'staging'
      }), {
        config: {host: 's1', user: 's2', pass: 's3', port: 2},
        env: 'staging'
      })
    })

    after(() => fs.unlinkSync(fpath))
  })
})
