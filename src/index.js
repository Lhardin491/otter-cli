const chalk = require('chalk')
const { program } = require('commander')
const leven = require('leven')
const { commands } = require('./commands')

const pkgJson = require('../package.json')
program
  .version(pkgJson.version)
  .usage('<command> [options]')
  // .option('--version', 'Print CLI version')
  .option('--verbose', 'Increase logging verbosity')

program.arguments('<command>').action(cmd => {
  printUnknownCommand(cmd)
  process.exit(1)
})

function handleError (err) {
  if (program.verbose) {
    console.error(err.message)
  } else {
    // Some error messages (esp. custom ones) might have `.` at the end already.
    const message = err.message.replace(/\.$/, '')
    console.error(
      `${message}. ${chalk.dim(
        `Run CLI with ${chalk.reset('--verbose')} ${chalk.dim(
          'flag for more details.'
        )}`
      )}`
    )
  }
  if (err.stack) {
    console.log(chalk.dim(err.stack))
  }
  process.exit(1)
};

function printUnknownCommand (cmdName) {
  const availableCommands = program.commands.map((cmd) => cmd._name)
  const suggestion = availableCommands.find((cmd) => {
    return leven(cmd, cmdName) < cmd.length * 0.4
  })
  let errorMsg = `Unrecognized command "${chalk.bold(cmdName)}".`
  if (suggestion) {
    errorMsg += ` Did you mean "${suggestion}"?`
  }
  if (cmdName) {
    console.error(errorMsg)
    console.info(
      `Run ${chalk.bold(
        '"otter --help"'
      )} to see a list of all available commands.`
    )
  } else {
    program.outputHelp()
  }
}

function addCommand (command) {
  const options = command.options || []
  const cmd = program
    .command(command.name)
    .action(async function (...args) {
      const passedOptions = this.opts()
      const argv = Array.from(args).slice(0, -1)

      try {
        await command.func(argv, passedOptions)
      } catch (error) {
        handleError(error)
      }
    })

  if (command.description) {
    cmd.description(command.description)
  }

  options.forEach(opt => {
    cmd.option(
      opt.name,
      opt.description,
      opt.default
    )
  })
}

async function run () {
  try {
    await setupAndRun()
  } catch (e) {
    handleError(e)
  }
}

async function setupAndRun () {
  commands.forEach(command => addCommand(command))

  program.parse(process.argv)

  if (program.rawArgs.length === 2) {
    program.outputHelp()
  }

  // We handle --version as a special case like this because both `commander`
  // and `yargs` append it to every command and we don't want to do that.
  // E.g. outside command `init` has --version flag and we want to preserve it.
  if (program.args.length === 0 && program.rawArgs.includes('--version')) {
    console.log(program.version)
  }
}

module.exports = { run }
