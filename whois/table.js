
var Table = require('cli-table')

var clean = {
  'top': '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  'bottom': '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  'left': '',
  'left-mid': '',
  'mid': '',
  'mid-mid': '',
  'right': '',
  'right-mid': '',
  'middle': ''
}


var render = ({head, rows, output}) => {

  var table = new Table({
    style: {
      head: output === 'clean' ? [] : ['green', 'bold'],
      compact: true
    },
    chars: output === 'clean' ? clean : {},
    head: (head || []).map((th) => th.toUpperCase())
  })

  rows.forEach((row) => table.push(row))

  return table.toString()
}

module.exports = {render}
