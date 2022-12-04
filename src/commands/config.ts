import { Command } from 'commander'
import { GlobalSettings } from '../classes/GlobalSettings'
import { VideoRenameSettings } from '../modules/video-renamer/video-renamer'
import { VideoRenamerConfigCommand } from '../modules/video-renamer/video-renamer.config.command'

// import logs from '../utilities/logs'

export interface ConfigOptions {
  all?: boolean
  reset?: boolean
}

export interface VideoRenameConfigOptions extends VideoRenameSettings {
  showAll?: boolean
}

export class ConfigCommand {
  private command: Command
  
  // @ts-ignore
  private videoRenameCommands: VideoRenamerConfigCommand
  
  constructor () {
    GlobalSettings.init()
  }
  
  public register (program: Command) {
    this.command = program
      .command('config')
      .description('Read and write ClI\'s settings.')
      .option('-a, --all', 'Read all existing settings')
      .option('-r, --reset', 'Reset and remove all existing settings')
      .action((options: ConfigOptions) => this.action(options))
      .showHelpAfterError('(add --help for additional information)')
    
    // each module has its own config command and registers it here
    this.videoRenameCommands = new VideoRenamerConfigCommand(this.command)
  }
  
  private action (options: ConfigOptions) {
    // If no options are specified, show help
    if (Object.keys(options).length === 0) {
      return this.command.help()
    }
    
    if (options.reset) {
      return GlobalSettings.reset()
    }
    
    if (options.all) {
      return GlobalSettings.readAllAndPrint()
    }
  }
}

