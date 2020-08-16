const otter = require('ottermator')

function build (argv, passedOptions) {
  console.log('Building project.')
  otter.Builder(readConfig())
}

function readConfig () {
  return require(process.cwd() + '/config.js')
}

module.exports = build
