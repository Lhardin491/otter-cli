const fs = require('fs')
const files = require('../../lib/files')

function createProject (projectName) {
  const dir = [files.getCurrentDirectoryBase(), projectName].join('')
  fs.mkdirSync(projectName)
  fs.mkdirSync([projectName, 'cucumber'].join('/'))
  createBuildFiles(projectName)
}

function createBuildFiles (path) {
  fs.writeFileSync(path + '/build.js', 'const otter = require(\'ottermator\')\notter.Builder(require(\'./config\'))\n\n')
  fs.writeFileSync(path + '/config.js',
  `const Otter = require('ottermator')
  const { Extract, Schema } = Otter
  module.exports = {
    domains: {
    domain: {}
  },
  externals: {}\n}\n`)
  fs.writeFileSync(path + '/cucumber.js', 'process.env.MOCK = 1\n')
  fs.writeFileSync(path + '/index.js', 'require(\'dotenv\').config()\n\nconst express = require(\'express\')\nconst app = express()\nconst bodyparser = require(\'body-parser\')\n\napp.use(bodyparser.json())\napp.use(require(\'./domains/routes\'))\napp.listen(3000)\n')
  const package = {
    name: path,
    version: '1.0.0',
    description: '',
    main: 'index.js',
    dependencies: {
      dotenv: '^8.2.0',
      express: '^4.17.1',
      mongodb: '^3.5.5',
      ottermator: '0.0.12'
    },
    devDependencies: {
      cucumber: '^6.0.5',
      newman: '^5.0.0',
      nyc: '^15.0.1'
    },
    scripts: {
      start: 'node index.js',
      build: 'node build.js',
      test: 'cucumber-js cucumber/* -r cucumber.js -r domains',
      newman: 'newman run testing-collection.json',
      coverage: 'nyc npm run test'
    },
    author: '',
    license: 'ISC'
  }
  fs.writeFileSync(path + '/package.json', JSON.stringify(package, null, 4))
}

module.exports = {
  createProject
}
