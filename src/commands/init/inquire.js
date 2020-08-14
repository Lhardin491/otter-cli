const inquirer = require('inquirer')

module.exports = {
  askProjectName: () => {
    const questions = [{
      name: 'projectName',
      type: 'input',
      message: 'project name:',
      validate: (value) => {
        if (value.length && !value.includes(' ')) {
          return true
        } else {
          return 'Please give a valid project name.'
        }
      }
    }]
    return inquirer.prompt(questions)
  }
}
