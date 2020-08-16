const execa = require('execa')

module.exports = {
  init,
  install,
  installDev,
  uninstall,
  installAll
}

const packageManagers = {
  yarn: {
    init: ['init', '-y'],
    install: ['add'],
    installDev: ['add', '-D'],
    uninstall: ['remove'],
    installAll: ['install']
  },
  npm: {
    init: ['init', '-y'],
    install: ['install', '--save', '--save-exact'],
    installDev: ['install', '--save-dev', '--save-exact'],
    uninstall: ['uninstall', '--save'],
    installAll: ['install']
  }
}

function configurePackageManager ({ packageNames, action, options }) {
  const pm = options.npm ? 'npm' : 'yarn'
  const [executable, ...flags] = packageManagers[pm][action]
  const args = [executable, ...flags, ...packageNames]
  return executeCommand({ command: pm, args, options })
}

function executeCommand ({ command, args, options }) {
  return execa(command, args, {
    stdio: options.silent ? 'pipe' : 'inherit',
    cwd: options.root
  })
}

function init (options) {
  return configurePackageManager({ action: 'init', options })
}

function install (packageNames, options) {
  return configurePackageManager({ packageNames, action: 'install', options })
}

function installDev (packageNames, options) {
  return configurePackageManager({ packageNames, action: 'installDev', options })
}

function uninstall (packageNames, options) {
  return configurePackageManager({ packageNames, action: 'uninstall', options })
}

function installAll (options) {
  return configurePackageManager({ packageNames: [], action: 'installAll', options })
}
