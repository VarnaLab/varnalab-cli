
var Table = require('cli-table')

var chars = {
  utf8: {},
  clean: {
      'top': ''
    , 'top-mid': ''
    , 'top-left': ''
    , 'top-right': ''
    , 'bottom': ''
    , 'bottom-mid': ''
    , 'bottom-left': ''
    , 'bottom-right': ''
    , 'left': ''
    , 'left-mid': ''
    , 'mid': ''
    , 'mid-mid': ''
    , 'right': ''
    , 'right-mid': ''
    , 'middle': ''
  }
}


module.exports = (args) => (head, rows) => {
  var output = args.output || 'utf8'

  var table = new Table({
    style: {
      head: ['green', 'bold'],
      compact: true
    },
    chars: chars[output] || {},
    head: (head || []).map((th) => th.toUpperCase())
  })

  rows.forEach((row) => table.push(row))

  return table.toString()
}
