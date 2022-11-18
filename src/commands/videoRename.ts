import { Command } from 'commander'
import * as chalk from 'chalk'

export class VideoRenameCommand {
  constructor (program: Command) {
    program.command('video-rename')
      .description('Rename Zoom video files using the Boolean pattern and eventually copy them to a specific folder like Google Drive.\n' +
        'To be able to copy the file to a folder, first that folder must be configured. To do so, just run\n' +
        chalk.yellow('boolean config -f [folder_path]'))
      .option('-r, --revert', 'Revert the rename operation.')
      .option('-u, --upload', 'Upload renamed files to Google Drive folder, if this is configured.')
      .action((options) => {
        // writeSection('RENAME')
        
        if (options.revert) {
          // revert()
        } else {
          // rename(options.upload)
        }
      })
  }
}
