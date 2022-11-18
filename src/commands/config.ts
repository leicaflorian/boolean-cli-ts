import { Command } from 'commander'
import Conf, { Schema } from 'conf'
import * as chalk from 'chalk'
import * as inquirer from 'inquirer'

export interface ConfigOptions {
  videosFolder: string;
  multipartVideos: boolean,
  all: boolean
  reset: boolean
}

export class ConfigCommand {
  private command: Command
  
  constructor (program: Command) {
    GlobalSettings.init()
    
    //TODO:: would be nice to create settings as commands like this:
    // video-rename.videos-folder
    // video-rename.multipart-videos
    
    this.command = program
      .command('config')
      .description('Read and write ClI\'s settings.')
      .option('-f, --videos-folder [path]', 'Path to local sync of Google Drive video folder')
      .option('-m, --multipart-videos [bool]', 'If true, when renaming a video, will be prompted with the right name suggestion')
      .option('-a, --all', 'Read all existing settings')
      .option('-r, --reset', 'Reset and remove all existing settings')
      .action((options: ConfigOptions) => this.action(options))
      .showHelpAfterError('(add --help for additional information)')
  }
  
  action (options: ConfigOptions) {
    // If no options are specified, show help
    if (Object.keys(options).length === 0) {
      this.command.help()
    }
    
    if (options.reset) {
      GlobalSettings.reset().then()
    }
    
    if (options.all) {
      GlobalSettings.readAll()
    }
    
    if (options.videosFolder) {
      if (typeof options.videosFolder === 'string') {
        GlobalSettings.assignKeyValue('videosFolder', options.videosFolder)
      } else {
        GlobalSettings.readKeyValue('videosFolder')
      }
    }
    
    if (options.multipartVideos) {
      if (typeof options.multipartVideos === 'string') {
        GlobalSettings.assignKeyValue('multipartVideos', options.multipartVideos === 'true')
      } else {
        GlobalSettings.readKeyValue('multipartVideos')
      }
    }
  }
}

export class GlobalSettings {
  static config: Conf
  
  static init () {
    this.config = new Conf({
      configName: 'boolean',
      projectName: 'boolean',
      schema: this.configSchema,
      migrations: this.configMigrations
    })
  }
  
  static get configSchema (): Schema<any> {
    return {
      videosFolder: {
        type: 'string'
      },
      multipartVideos: {
        type: 'boolean',
        default: false
      }
    }
  }
  
  static get configMigrations () {
    return {
      /*'0.0.1': store => {
        store.set('debugPhase', true)
      },
      '1.0.0': store => {
        store.delete('debugPhase')
        store.set('phase', '1.0.0')
      },
      '1.0.2': store => {
        store.set('phase', '1.0.2')
      },
      '>=2.0.0': store => {
        store.set('phase', '>=2.0.0')
      }*/
    }
  }
  
  static readKeyValue (key: string) {
    const result = this.config.get(key) as any
    
    console.log(chalk.bold(key) + ':', result)
  }
  
  static assignKeyValue (key: string, value: any) {
    this.config.set(key, value)
    
    this.readKeyValue(key)
  }
  
  static readAll () {
    Object.keys(this.configSchema).forEach(key => {
      const value = this.config.get(key)
      
      console.log(`- ${chalk.bold(key)}:`, chalk.green(value))
    })
  }
  
  static async reset () {
    const result = await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Are you sure you want to reset all configurations? This can\'t be undone.',
        name: 'confirm',
        default: false
      }
    ])
    
    if (result.confirm) {
      this.config.clear()
    }
  }
}
