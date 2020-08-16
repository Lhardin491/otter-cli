const path = require('path')
const clear = require('clear')
const figlet = require('figlet')
const chalk = require('chalk')
const inquirer = require('./inquire')
const projectBuilder = require('./projectBuilder')

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
  projectBuilder.createProject({ projectName, directoryName })
}

module.exports = init
