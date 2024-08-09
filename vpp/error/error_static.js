
const NotImplement = details => new Error('NotImplement: ' + details)

const FileNotFound = details => new Error('FileNotFound: ' + details)

const VSyntaxError = details => new Error('VSyntaxError: ' + details)

module.exports = { NotImplement, FileNotFound, VSyntaxError }