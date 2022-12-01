import BasicCommand from '../../classes/BasicCommand'
import { Command } from 'commander'
// @ts-ignore
import * as chalk from 'chalk'
import { VideoRenamer } from './video-renamer'
import { GlobalSettings } from '../../classes/GlobalSettings'

export interface VideoRenamerCommandOptions {
  revert?: boolean;
  upload?: boolean;
  dir?: boolean;
}

export class VideoRenamerCommand extends BasicCommand<VideoRenamer> {
  constructor () {
    super()
    
    this.module = new VideoRenamer()
  }
  
  public register (program: Command) {
    this.command = program.command('video-rename')
      .description('Rename Zoom video files using the Boolean pattern and eventually copy them to a specific folder like Google Drive.\n' +
        'To be able to copy the file to a folder, first that folder must be configured. To do so, just run\n' +
        chalk.yellow(`${GlobalSettings.cliName} config video-rename --drive-folder [folder_path]`))
      .option('-r, --revert', 'Revert the rename operation.')
      .option('-u, --upload', 'Upload renamed files to Google Drive folder, if this is configured.')
      .option('-d, --dir [path]', 'Specify folder where to perform the action.')
      .action((options) => this.action(options))
  }
  
  protected async action (options: VideoRenamerCommandOptions) {
    // writeSection('RENAME')
    let dir: string = typeof options.dir === 'string' ? options.dir : undefined
  
    if (options.revert) {
      this.module.revert(dir)
    } else {
      await this.module.rename(options.upload, dir)
    }
  }
}
