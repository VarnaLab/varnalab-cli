
var os = require('os')
var fs = require('fs')
var path = require('path')


module.exports = () => {
  var config
  var dotfile = path.resolve(os.homedir(), '.varnalab-cli')

  if (fs.existsSync(dotfile)) {
    try {
      config = JSON.parse(fs.readFileSync(dotfile))
    }
    catch (err) {
      throw new Error('Error: .varnalab-cli ' + err.message)
    }
  }

  return config
}
