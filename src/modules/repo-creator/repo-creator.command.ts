import BasicCommand from '../../classes/BasicCommand'
import { RepoCreator } from './repo-creator'
import { Command } from 'commander'

export interface RepoCreatorCommandOptions {
  org?: string;
  public?: boolean;
  delete?: boolean;
  existIgnore?: boolean;
}

export class RepoCreatorCommand extends BasicCommand<RepoCreator> {
  constructor () {
    super()
    
    this.module = new RepoCreator()
  }
  
  register (program: Command): void {
    this.command = program.command('repo')
      .description('Create a remote repo, clones it and eventually scaffolds its files.')
      .usage('repo_title [organization] [option]')
      .argument('<repo_title>', 'Title of the repo will be created')
      .option('-o, --org <org>', 'organization where to create the repo')
      .option('-p, --public', 'create a public repo')
      .option('-d, --delete', 'delete a repo irreversibly')
      .option('-ei, --existIgnore', 'Ignore if the repo already exists and continue cloning it')
      .showHelpAfterError()
      .action((...args) => this.action(args[0], args[1]))
  }
  
  protected async action (repoTitle: string, options: RepoCreatorCommandOptions) {
    let organization = options.org ? options.org.replace(/^=/, '') : null
    
    if (options.delete) {
      this.module.deleteRepo(repoTitle, organization)
      
      return
    }
  
    this.module.checkGITCLI()
    this.module.checkGHCLI()
    
    const newRepo = this.module.createRepo(repoTitle, organization, options.public, options.existIgnore)
    
    // clone repo
    this.module.cloneRepo(newRepo.folderName, newRepo.repoName)
    
    // scaffold files
    this.module.createScaffolding(newRepo.folderName)
    
    // change active directory
    // this.module.changeActiveDirectory(newRepo.folderName)
  }
}
