import BasicCommand from '../../classes/BasicCommand'
import { Scaffold } from './scaffold'
import { Command } from 'commander'
import logs from '../../utilities/logs'
import * as chalk from 'chalk'
import { getWorkingFolderName } from '../../utilities/fs'
import { writeSection } from '../../utilities/ui'

export interface ScaffoldCommandOptions {
  all?: boolean
  html?: boolean | string
  css?: boolean | string
  js?: boolean | string
  readme?: boolean | string
  img?: boolean
  dir?: string
}

export class ScaffoldCommand extends BasicCommand<Scaffold> {
  constructor () {
    super()
    
    this.module = new Scaffold()
  }
  
  register (program: Command): void {
    this.command = program.command('scaffold')
      .description('Create basic scaffold for different projects.')
      .argument('[string]', 'file title', null)
      .usage('[file_name] [option] [value]')
      .option('-a, --all', 'Basic HTML, CSS and Imgs')
      .option('-h, --html [fileName]', 'Basic HTML (default: index.html)')
      .option('-c, --css [fileName]', 'Basic CSS (default: style.css)')
      .option('-j, --js [fileName]', 'Basic JS (default: main.js)')
      .option('-i, --img', 'Basic Imgs')
      .option('-r, --readme [fileName]', 'Readme file')
      .option('-d, --dir [path]', 'Specify folder where to perform the action.')
      .showHelpAfterError()
      .action((...args) => this.action(args[0], args[1]))
  }
  
  public async action (fileName: string, options: ScaffoldCommandOptions) {
    // console.log(fileName, options)
    writeSection('Scaffold')
    
    logs.info(`Working in folder "${chalk.green(getWorkingFolderName(options.dir))}".\n`)
    
    const keysToAvoidForWizard = ['all', 'html', 'css', 'js', 'readme', 'img']
    
    // auto show the wizard if no options are provided
    if (!Object.keys(options).some(key => keysToAvoidForWizard.includes(key))) {
      const wizardResult = await this.module.showWizard()
      
      // Store the wizard result in the options object
      wizardResult.filesToCreate.forEach(file => {
        options[file] = wizardResult[`${file}FileName`] || true
      })
    }
    
    let cdnLibraries
    
    if (options.html || options.all) {
      // get the list of third party libraries to add
      cdnLibraries = await this.module.askForCDNLibraries()
      
      await this.module.html(options.dir, {
        fileName: typeof options.html === 'string' ? options.html : fileName,
        cssFileName: typeof options.css === 'string' ? options.css : fileName,
        jsFileName: typeof options.js === 'string' ? options.js : fileName,
        withCss: !!options.css || !!options.all,
        withJs: !!options.js || !!options.all
      }, cdnLibraries)
    }
    
    if (options.css || options.all) {
      await this.module.css(typeof options.css === 'string' ? options.css : fileName, options.dir, cdnLibraries)
    }
    
    if (options.js || options.all) {
      // check if the questions has already been asked
      if (!cdnLibraries) {
        // get the list of third party libraries to add
        cdnLibraries = await this.module.askForCDNLibraries({ mustInitInJS: true })
      }
      
      await this.module.js((typeof options.js === 'string' ? options.js : fileName), cdnLibraries, options.dir)
    }
    
    if (options.img || options.all) {
      await this.module.img(options.dir)
    }
    
    if (options.readme || options.all) {
      await this.module.readme((typeof options.readme === 'string' ? options.readme : fileName), options.dir)
    }
    
    this.module.askForInitialCommit(options.dir)
  }
}
