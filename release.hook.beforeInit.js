const shell = require('shelljs')

// const mergeToBranches = ["main"]
// const workingBranch = process.argv[2]
// const commitMessage = process.argv[3]

shell.exec(`git checkout main`, { silent: true })
shell.exec(`git merge dev`, { silent: false })
shell.exec(`git push origin main`, { silent: true })
