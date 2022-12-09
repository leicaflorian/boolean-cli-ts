const fs = require('fs')
const path = require('path')

const newVersion = process.argv[2]
const filePath = process.argv[3]

console.log(`Storing version in "${filePath}"`)

fs.writeFileSync(path.resolve(filePath), newVersion)

console.log('Version stored successfully!')
