import * as path from 'path'
import * as inquirer from 'inquirer'
import * as shell from 'shelljs'
import * as chalk from 'chalk'
import logs from '../../utilities/logs'
import { ModuleWithSettings } from '../../classes/ModuleWithSettings'
import { upperFirst } from 'lodash'
import { ScaffoldCommand } from '../scaffold/scaffold.command'

export interface RepoCreatorSettings {

}

export interface RepoCreatorNewRepo {
  folderName: string;
  repoName: string;
}

export class RepoCreator extends ModuleWithSettings<RepoCreatorSettings> {
  
  formatVisibility (isPublic: boolean, ucFirst = false) {
    let visibility = isPublic ? 'public' : 'private'
    const color = isPublic ? 'green' : 'cyan'
    
    if (ucFirst) {
      visibility = upperFirst(visibility)
    }
    
    return chalk[color].bold(visibility)
  }
  
  /**
   * Check if GitHub CLI is installed
   */
  checkGHCLI () {
    logs.info('Checking github-cli installation...')
    
    if (!shell.which('gh')) {
      logs.error(`Sorry, this script requires ${chalk.red.bold('\'github-cli\'')}.
          Before proceeding please download it at https://cli.github.com/.
          After downloading it, please login with ${chalk.yellow.bold('\'gh auth login\'')}`)
      shell.exit(1)
    }
    
    if (shell.exec('gh auth status', { silent: true }).code === 1) {
      logs.error(`Sorry, you're not logged in to github-cli.
  Please login with ${chalk.yellow.bold('\'gh auth login\'')}.
  For more info, visit https://cli.github.com/manual/gh_auth_login`)
    }
  }
  
  /**
   * Check if Git CLI is installed
   */
  checkGITCLI () {
    logs.info('Checking git-cli installation...')
    
    if (!shell.which('git')) {
      logs.error(`Sorry, this script requires ${chalk.red.bold('\'git-cli\'')}.
  Before proceeding plead download it at https://git-scm.com/downloads`)
      shell.exit(1)
    }
  }
  
  createRepo (name: string, organization?: string, isPublic?: boolean, existIgnore?: boolean): RepoCreatorNewRepo | null {
    let repoName = name
    
    if (organization) {
      repoName = `${organization}/${name}`
    }
    
    logs.info(`Creating ${this.formatVisibility(isPublic)} repo ${chalk.yellow.bold(repoName)}...`)
    
    const res = shell.exec(`gh repo create ${repoName} --${isPublic ? 'public' : 'private'}`, { silent: true })
    
    if (res.code === 0 || existIgnore) {
      if (res.code !== 0) {
        logs.warn(`Error while creating repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`)
        logs.info(`Trying to continue anyway...`)
      } else {
        logs.info(`${this.formatVisibility(isPublic, true)} repo ${chalk.yellow.bold(repoName)} created at ${chalk.yellow.bold(res.stdout)}`)
      }
      
      return {
        folderName: name,
        repoName
      }
    } else {
      logs.error(`Error while creating repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`)
      shell.exit(1)
    }
  }
  
  cloneRepo (projName: string, repoName: string) {
    logs.info(`Cloning repo to ${chalk.yellow.bold(projName)}...`)
    
    const res = shell.exec(`gh repo clone ${repoName} && cd ${projName}`, { silent: true })
    const repoPath = path.resolve(projName)
    
    if (res.code === 0) {
      logs.info(`Repo cloned at ${chalk.green.bold(repoPath)}`)
      
      // shell.cd(projName)
    } else {
      logs.error(`Error while cloning repo ${chalk.yellow.bold(repoName)}.
            ${res.stderr}`)
      shell.exit(1)
    }
  }
  
  createScaffolding (projName: string) {
    inquirer
      .prompt([
        {
          name: 'create_scaffolding',
          message: `Vuoi creare lo scaffolding iniziale per questo progetto?`,
          type: 'confirm',
          default: true
        }
      ])
      .then((answers) => {
        if (answers.create_scaffolding) {
          const scaffold = new ScaffoldCommand()
          
          scaffold.action(projName, { dir: projName })
        }
      })
      .catch((error) => {
        console.log(error)
        
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      })
  }
  
  deleteRepo (name: string, organization?: string) {
    let repoName = name
    
    if (organization) {
      repoName = `${organization}/${name}`
    } else if (!name.includes('/')) {
      const data = shell.exec('gh repo list --json name,nameWithOwner', { silent: true })
      const repoList = JSON.parse(data.stdout)
      
      const foundedRepo = repoList.find((repo: any) => repo.name === repoName)
      
      if (!foundedRepo) {
        logs.error(`Repo ${chalk.yellow.bold(repoName)} not found.`)
        shell.exit(1)
      }
      
      repoName = foundedRepo.nameWithOwner
    }
    
    inquirer.prompt([
      {
        name: 'delete_repo',
        message: `Sei sicuro di voler eliminare definitivamente la repo ${chalk.yellow.bold(repoName)}?`,
        type: 'confirm',
        default: false
      }]
    ).then((answers) => {
      if (answers.delete_repo) {
        const deleteRes = shell.exec(`gh repo delete ${repoName} --confirm`)
        
        if (deleteRes.code === 0) {
          logs.info(`Repo ${chalk.yellow.bold(repoName)} deleted`)
        }
        
        // TODO:: would be nice to also ask if delete the local folder
      }
    })
  }
  
  changeActiveDirectory (dir: string) {
    shell.cd(dir)
  }
}
