const fs = require('fs')
const path = require('path')

storeVersion()

function storeVersion () {
  console.log('Storing version in bin/version.txt')
  
  const newVersion = getCurrentVersion()
  
  fs.writeFileSync(path.resolve(__dirname, 'bin/version.txt'), newVersion)
  
  console.log('Version stored successfully!')
}

function getCurrentVersion () {
  const fileContent = fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')
  
  return JSON.parse(fileContent).version
}

module.exports.storeVersion = storeVersion
