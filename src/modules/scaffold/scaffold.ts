import * as inquirer from 'inquirer'
import * as shell from 'shelljs'
import logs from '../../utilities/logs'
import { ModuleWithSettings } from '../../classes/ModuleWithSettings'
import { choicesValidator, stringValidator } from '../../utilities/validators'
import {
  readTemplate,
  prepareFileName,
  writeToFile,
  copyFromTemplates,
  copyFolderFromTemplates, prepareTitle, getPath, makeFolder
} from '../../utilities/fs'

export interface ScaffoldSettings {
}

export interface ScaffoldWizardResult {
  projectName: string;
  filesToCreate: string[];
  htmlFileName?: string;
  phpFileName?: string;
  cssFileName?: string;
  jsFileName?: string;
  readmeFileName?: string;
}

export interface ScaffoldFileSettings {
  fileName: string;
}

export interface ScaffoldHTMLSettings extends ScaffoldFileSettings {
  cssFileName: string;
  jsFileName: string;
  withCss: boolean
  withJs: boolean;
  isPhp?: boolean;
}

export interface ScaffoldCDNLibraries {
  isLink?: boolean;
  isScript?: boolean;
  mustInitInJS?: boolean;
  name: string;
  src: string;
}

export class Scaffold extends ModuleWithSettings<ScaffoldSettings> {
  /**
   * Create necessary files for html projects
   *
   * @param {string|null} dir
   * @param {ScaffoldHTMLSettings} settings
   * @param {ScaffoldCDNLibraries[]} cdnLibraries
   */
  async html (dir: string | null, settings: ScaffoldHTMLSettings, cdnLibraries?: ScaffoldCDNLibraries[]): Promise<void> {
    const extension = settings.isPhp ? 'php' : 'html'
    
    logs.logStarting(extension.toUpperCase())
    
    // options for the mustache template
    const mustacheOptions: any = {
      title: prepareTitle(dir, settings.fileName),
      css: settings.withCss,
      cssFileName: prepareFileName(settings.cssFileName, 'css', 'style'),
      js: settings.withJs,
      jsFileName: prepareFileName(settings.jsFileName, 'js', 'main'),
      libraries: cdnLibraries ?? [],
      ...this.prepareTemplateCDNLibraries(cdnLibraries)
    }
    
    const htmlFile = prepareFileName(settings.fileName, extension, 'index')
    const template = readTemplate(`index.${extension}`, mustacheOptions)
    
    const result = await writeToFile(htmlFile, template, dir)
    
    if (result) {
      logs.logFileCreated(htmlFile)
    }
    
    await this.addFavIcon(dir)
    
    logs.info('Completed!\n', false)
  }
  
  /**
   * Create necessary files for CSS
   *
   * @param {string} fileName
   * @param {string} [dest]
   * @param cdnLibraries
   */
  async css (fileName: string, dest: string = '', cdnLibraries?: ScaffoldCDNLibraries[]) {
    logs.logStarting('CSS')
    
    const cssFile = prepareFileName(fileName, 'css', 'style')
    const template = readTemplate('style.css', {
      hasBS: !!cdnLibraries?.find(lib => lib.name === 'bootstrap')
    })
    
    const result = await writeToFile(`css/${cssFile}`, template, dest)
    
    if (result) {
      logs.logFileCreated(`css/${cssFile}`)
    }
    
    logs.info('Completed!\n', false)
  }
  
  /**
   * Create necessary files for JS
   *
   * @param {string} fileName
   * @param {ScaffoldCDNLibraries} cdnLibraries
   * @param {string} [dest]
   */
  async js (fileName: string, cdnLibraries: any, dest: string = '') {
    logs.logStarting('JS')
    
    const jsFile = prepareFileName(fileName, 'js', 'main')
    const template = readTemplate('main.js', {
      ...this.prepareTemplateCDNLibraries(cdnLibraries)
    })
    
    const result = await writeToFile(`js/${jsFile}`, template, dest)
    
    if (result) {
      logs.logFileCreated(`js/${jsFile}`)
    }
    
    logs.info('Completed!\n', false)
  }
  
  /**
   * Copy default IMG files
   * @param {string} [dest]
   */
  async img (dest: string = '') {
    logs.logStarting('IMG')
    
    const copiedFiles = await copyFolderFromTemplates('imgs', 'imgs', dest)
    
    copiedFiles.forEach(file => logs.logFileCreated(file))
    
    logs.info('Completed!\n', false)
  }
  
  /**
   *
   */
  async addFavIcon (dir: string = '') {
    const filePath = 'imgs/favicon.ico'
    
    await copyFromTemplates('favicon.ico', filePath, dir)
    logs.logFileCreated(filePath)
  }
  
  /**
   *
   * @param fileName
   * @param {string} [dest]
   */
  async readme (fileName?: string, dest: string = '') {
    logs.logStarting('README')
    
    const readmeFile = prepareFileName(fileName, 'md', 'README')
    const template = readTemplate('README.md', {
      title: prepareTitle(dest)
    })
    
    const result = await writeToFile(readmeFile, template, dest)
    
    if (result) {
      logs.logFileCreated(readmeFile)
    }
    
    logs.info('Completed!\n', false)
  }
  
  async vueVite (projectName?: string, dest: string = ''): Promise<string | null> {
    logs.info('Creating Vue Vite project...')
    
    if (!projectName) {
      projectName = (await inquirer.prompt([
        {
          name: 'projectName',
          type: 'input',
          message: 'Specify the project name:',
          validate: stringValidator
        }
      ])).projectName
    }
    
    const path = makeFolder(getPath(dest, projectName))
    
    if (!path) {
      logs.error('The project could not be created')
      return null
    }
    
    logs.info('Project created in: ' + path)
    
    shell.cd(path)
    
    logs.info('Scaffolding project...')
    
    // download original template
    // const result = shell.exec(`npx degit https://github.com/vitejs/vite.git/packages/create-vite/template-vue .`)
    
    // download custom made template for boolean
    const result = shell.exec(`npx degit https://github.com/leicaflorian/vite-vue-boolean-template.git .`, { silent: true })
    
    if (result.code === 0) {
      logs.info('Project scaffolded')
      
      //TODO:: update package.json with project name and version
    } else {
      logs.error('The project could not be created.\n' + result.stderr)
    }
    
    logs.info('Installing dependencies...')
    shell.exec('npm install')
    
    return path
  }
  
  /**
   * Show a wizard for scaffolding a new project
   *
   * @return {Promise<ScaffoldWizardResult>}
   */
  async showWizard (): Promise<ScaffoldWizardResult> {
    logs.log(`Welcome to the HTML Scaffold Wizard!
    This wizard will help you create the basic scaffold for your project.\n`)
    
    type PartialWizardResult = Pick<ScaffoldWizardResult, 'projectName' | 'filesToCreate'>;
    
    return inquirer.prompt([
      // currently not used
      /*
      {
        name: 'projectName',
        message: `Specify the project name:`,
        type: 'string',
        default: path.basename(path.resolve('.')),
        validate: stringValidator
      },*/
      {
        name: 'filesToCreate',
        message: `Choose which type of file you want to create:`,
        type: 'checkbox',
        choices: [
          {
            name: 'HTML',
            value: 'html'
          }, {
            name: 'PHP',
            value: 'php'
          }, {
            name: 'CSS',
            value: 'css'
          }, {
            name: 'JS',
            value: 'js'
          }, {
            name: 'Images',
            value: 'img'
          },
          new inquirer.Separator(),
          {
            name: 'README',
            value: 'readme',
            checked: true
          }
        ],
        validate: choicesValidator
      },
      {
        name: 'htmlFileName',
        message: `Specify HTML file name:`,
        type: 'string',
        default: 'index',
        when: (answers: PartialWizardResult) => answers.filesToCreate.includes('html')
      },
      {
        name: 'phpFileName',
        message: `Specify PHP file name:`,
        type: 'string',
        default: 'index',
        when: (answers: PartialWizardResult) => answers.filesToCreate.includes('php')
      },
      {
        name: 'cssFileName',
        message: `Specify CSS file name:`,
        type: 'string',
        default: 'style',
        when: (answers: PartialWizardResult) => answers.filesToCreate.includes('css')
      },
      {
        name: 'jsFileName',
        message: `Specify JS file name:`,
        type: 'string',
        default: 'main',
        when: (answers: PartialWizardResult) => answers.filesToCreate.includes('js')
      },
      {
        name: 'readmeFileName',
        message: `Specify README file name:`,
        type: 'string',
        default: 'README',
        when: (answers: PartialWizardResult) => answers.filesToCreate.includes('readme')
      }
    ])
  }
  
  /**
   * Ask to initialize git repository
   */
  askForInitialCommit (dir?: string) {
    if (dir) {
      shell.cd(dir)
    }
    
    // if git command not available OR git already initialized, skip
    if (!shell.which('git') || shell.exec('git log --reverse', { silent: true }).code === 0) {
      return
    }
    
    // TODO:: check if git is already initialized otherwise ask to initialize
    
    inquirer.prompt([
      {
        name: 'make_commit',
        message: `Si desidera creare un commit iniziale con i file appena creati?`,
        type: 'confirm',
        default: true
      }
    ]).then(answers => {
      if (answers.make_commit) {
        shell.exec('git init')
        shell.exec('git add .')
        shell.exec('git commit -m "Initial scaffolding"')
        
        logs.info(`Commit creato.\n`)
        
        shell.exec('git push')
        
        logs.info(`Dati inviati al repository remoto.\n`)
      }
    })
  }
  
  /**
   * Ask user for CDN libraries to include
   */
  async askForCDNLibraries (filterBy?: any): Promise<ScaffoldCDNLibraries[]> {
    const choices = [
      {
        name: 'Bootstrap 5',
        value: {
          isLink: true,
          name: 'bootstrap',
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'
        }
      }, {
        name: 'Font Awesome 5',
        value: {
          isLink: true,
          name: 'fontawesome',
          src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
        }
      }, {
        name: 'Vue 3',
        value: {
          isScript: true,
          mustInitInJS: true,
          name: 'vue',
          src: 'https://unpkg.com/vue@3/dist/vue.global.js'
        }
      }, {
        name: 'Axios',
        value: {
          isScript: true,
          name: 'axios',
          src: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
        }
      }].filter((entry) => {
      const filterKeys = Object.keys(filterBy ?? {})
      
      if (!filterKeys.length) {
        return true
      }
      
      let toReturn = false
      
      filterKeys.forEach(key => {
        toReturn = entry.value[key] === filterBy[key]
      })
      
      return toReturn
    })
    
    if (!choices.length) {
      return []
    }
    
    const result = await inquirer.prompt([{
      name: 'libraries',
      message: `Si desidera aggiungere qualche libreria di terze parti? Lasciare deselezionato per saltare.`,
      type: 'checkbox',
      choices
    }])
    
    return result.libraries
  }
  
  /**
   *
   * @param libraries
   */
  prepareTemplateCDNLibraries (libraries: ScaffoldCDNLibraries[]) {
    if (!libraries || !libraries.length) {
      libraries = []
    }
    
    return {
      hasVue: !!libraries.find(lib => lib.name === 'vue'),
      hasBS: !!libraries.find(lib => lib.name === 'bootstrap')
    }
  }
}
