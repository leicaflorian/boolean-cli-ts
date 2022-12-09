const shell = require('shelljs')

const mergeToBranches = ["main"]
const workingBranch = process.argv[2]
const commitMessage = process.argv[3]

mergeToBranches.forEach(branch => {
  console.log(`Merging release branch to "${branch}"`)
  
  shell.exec(`git checkout ${branch}`, { silent: true })
  shell.exec(`git merge ${workingBranch} -m "${commitMessage}"`, { silent: false })
  shell.exec(`git push origin ${branch}`, { silent: true })
  
  // return to original branch
  shell.exec(`git checkout ${workingBranch}`, { silent: true })
})
