const path = require('path')
const fs = require('fs')
const clear = require('clear')
const figlet = require('figlet')
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const inquirer = require('./inquire')
const files = require('../../lib/files')
const PackageManager = require('../../lib/packageManager')
const DirectoryExistsError = require('./errors/DirectoryExistsError')

function setProjectDirectory (directory) {
  if (files.directoryExists(directory)) {
    throw new DirectoryExistsError()
  }

  try {
    mkdirp.sync(directory)
    process.chdir(directory)
  } catch (error) {
    console.error('Error occurred while trying to create project directory.', error)
  }

  return process.cwd()
}

async function installDeps ({ projectName, npm, root }) {
  console.log('Installing dependencies...')

  await PackageManager.installAll({ npm, silent: false, root })

  console.log('Done.')
}

function createBuildFiles (path, projectName) {
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
  const pkgJson = {
    name: projectName,
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
  fs.writeFileSync(path + '/package.json', JSON.stringify(pkgJson, null, 4))
}

async function createProject ({ projectName, directoryName, version, options }) {
  const projectDirectory = await setProjectDirectory(directoryName)

  try {
    createBuildFiles(projectDirectory, projectName)
    await installDeps({ projectName, npm: true, root: projectDirectory })
  } catch (error) {
    console.error('Error building project.', error)
  }
}

async function init (argv, passedOptions) {
  clear()

  console.log(
    chalk.yellow(
      figlet.textSync('otter', { horizontalLayout: 'full' })
    )
  )

  const { projectName } = await inquirer.askProjectName()
  const root = process.cwd()

  const directoryName = path.relative(root, projectName)

  console.log(`Creating project ${projectName}`)
  createProject({ projectName, directoryName })
}

module.exports = init
