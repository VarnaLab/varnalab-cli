
var table = require('./table')


module.exports = ({active, error, output='table'}) =>
  /table|clean/.test(output)
  ? (
    active
    ? table.render({
        head: ['mac', 'ip', 'host'],
        rows: active.map(({mac, ip, host}) => [mac, ip, host]),
        output
      })
    : error
  )

  : output === 'json'
  ? JSON.stringify({
      timestamp: Math.floor(Date.now() / 1000),
      [active ? 'active' : 'error']: active || error.message || error,
    })

  : new Error('Not supported output type!')
