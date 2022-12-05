const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const versionIncrement = process.argv[2]
let newVersion

incrementVersion()

shell.exec('npm run build')

storeVersion()

function incrementVersion () {
  if (versionIncrement) {
    const validIncrements = ['major', 'minor', 'patch']
    
    if (!validIncrements.includes(versionIncrement)) {
      console.error(`Invalid version increment: ${versionIncrement}. Valid increments are: ${validIncrements.join(', ')}`)
      
      return
    }
    
    console.log(`Bumping "${versionIncrement}" version...`)
    
    // --git-tag-version=false prevents npm version from creating a new tag
    // --force is needed to force the version to be updated even if there are no changes
    const res = shell.exec(`npm version ${versionIncrement}`, { silent: true })
    
    if (res.code !== 0) {
      console.error(res.stderr)
      
      throw new Error('Error bumping version')
    } else {
      newVersion = res.stdout.toString().replace(/\n/g, '').trim()
      console.log(`Version bumped successfully to ${newVersion}!`)
    }
  }
}

function storeVersion () {
  console.log('Storing version in bin/version.txt')
  
  newVersion = getCurrentVersion()
  
  fs.writeFileSync(path.resolve(__dirname, 'bin/version.txt'), newVersion)
  
  console.log('Version stored successfully!')
}

function getCurrentVersion () {
  const fileContent = fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8')
  
  return JSON.parse(fileContent).version
}
