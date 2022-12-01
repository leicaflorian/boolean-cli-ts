import { VideoRenameConfigOptions } from '../../commands/config'
import { Command } from 'commander'
import { GlobalSettings } from '../../classes/GlobalSettings'
import * as chalk from 'chalk'
import * as fs from 'fs'
import logs from '../../utilities/logs'

export class VideoRenamerConfigCommand {
  command: Command
  
  constructor (program: Command) {
    this.command = program.command('video-rename')
      .description('Settings for video-rename command')
      .option('-s, --show-all', 'Read all existing settings for video-rename command')
      .option('--drive-folder [path]', 'Path to local sync of Google Drive video folder')
      .option('--multipart-files [bool]', 'If true, when renaming a video, will be prompted with the right name suggestion')
      .action((options: VideoRenameConfigOptions) => this.action(options))
  }
  
  private action (options: VideoRenameConfigOptions) {
    // If no options are specified, show help
    if (Object.keys(options).length === 0) {
      this.command.help()
    }
    
    const prefix = 'videoRename'
    
    if (options.showAll) {
      return GlobalSettings.readAllAndPrint(prefix)
    }
    
    Object.keys(options).forEach((key) => {
      let result
      
      if (typeof options[key] === 'string') {
        let value = options[key]
        
        if (key === 'multipartFiles') {
          // convert to boolean
          value = value === 'true'
        }
        
        result = GlobalSettings.assignKeyValue(prefix + '.' + key, value)
        
        // if assigning the value to driveFolder, must check that the folder exists
        if (key === 'driveFolder' && !fs.existsSync(result)) {
          logs.error(`The folder "${chalk.red(result)}" does not exist.`)
          GlobalSettings.assignKeyValue(prefix + '.' + key, '')
          
          return
        }
      } else {
        result = GlobalSettings.readKeyValue(prefix + '.' + key)
      }
      
      logs.info(chalk.cyan(key) + ': ' + (chalk.green(result) || chalk.italic('undefined')))
      
    })
  }
}
