class DirectoryExistsError extends Error {
  constructor (directory) {
    super(`Cannot initialize project because ${directory} already exists.`)
  }
}

module.exports = DirectoryExistsError
