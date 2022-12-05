import { getFolderFiles, getPath } from '../../utilities/fs'
import logs from '../../utilities/logs'

import * as fs from 'fs'
import * as path from 'path'
// @ts-ignore
import * as chalk from 'chalk'
// @ts-ignore
import * as inquirer from 'inquirer'
import { DriveFiles } from '../../classes/DriveFiles'
import { ModuleWithSettings } from '../../classes/ModuleWithSettings'
import { GlobalSettings } from '../../classes/GlobalSettings'

export interface VideoRenameSettings {
  driveFolder?: string;
  multipartFiles?: boolean;
}

export interface VideoRenameAnswers {
  video_number: number;
  video_part_number: number;
  lesson_code: number;
  lesson_name: string;
}

export interface VideoRenameFileNames {
  old: string;
  new: string,
  formatted: string
}

export interface VideoRenameJsonContent {
  date: string;
  files: VideoRenameFileNames[];
}

export class VideoRenamer extends ModuleWithSettings<VideoRenameSettings> {
  private readonly rootFolder: string
  
  constructor () {
    super()
    
    this.settingsPrefix = 'videoRename'
    this.rootFolder = getPath()
  }
  
  async revert (dir?: string) {
    const folder = dir ?? this.rootFolder
    const jsonFilePath = path.join(folder, '.rename.json')
    
    if (!fs.existsSync(jsonFilePath)) {
      logs.error('Nothing to revert.')
      return
    }
    
    // read the json file
    const jsonFile: VideoRenameJsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
    
    const confirmRename: { confirm: boolean } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Are you sure you want to revert the following files?' +
          `\n   - ${jsonFile.files.map(file => `${chalk.grey(file.new)} -> ${chalk.green(file.old)}`).join('\n   - ')} `
      }
    ])
    
    if (confirmRename.confirm) {
      jsonFile.files.forEach((file) => {
        const oldPath = path.join(folder, file.old)
        const newPath = path.join(folder, file.new)
        
        if (fs.existsSync(newPath)) {
          fs.renameSync(newPath, oldPath)
          
          logs.info(`Restored file: ${chalk.grey(file.new)} -> ${chalk.green(file.old)}`)
        }
      })
      
      fs.rmSync(jsonFilePath)
    }
  }
  
  public async rename (mustUpload: boolean, dir?: string) {
    const folder = dir ?? this.rootFolder
    
    logs.info(`Searching for video files in folder "${chalk.green(folder)}".`)
    
    const videoFiles = getFolderFiles(folder, '.mp4')
    
    // check if the folder contains video files
    if (videoFiles.length === 0) {
      return logs.error(`Can't find any "${chalk.yellow.bold('.mp4')}" file to rename.`)
    }
    
    logs.info(`Found ${videoFiles.length} files: ${videoFiles.map(file => chalk.bold.green(file)).join(', ')}`)
    
    if (mustUpload && !this.moduleSettings.driveFolder) {
      return logs.error(chalk.red(`Cartella Google Drive non configurata.
      Per configurarla usa il comando:
      ${chalk.yellow(`${GlobalSettings.cliName} config video-rename --drive-folder [folder_path]`)}`)
      )
    }
    
    const answers = await this.promptRenameQuestions(videoFiles)
    const fileNames = this.prepareFileNames(videoFiles, answers)
    const confirmRename: { confirm: boolean } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Confermi di voler rinominare i seguenti file?' +
          `\n   - ${fileNames.map(file => file.formatted).join('\n   - ')} `
      }
    ])
    
    if (confirmRename.confirm) {
      this.createInternalRenameDetails(fileNames, dir)
      
      fileNames.forEach((file) => {
        const oldPath = path.join(folder, file.old)
        const newPath = path.join(folder, file.new)
        
        fs.renameSync(oldPath, newPath)
        
        if (this.readSetting('driveFolder') && mustUpload) {
          logs.info(`Uploading file ${chalk.green(file.new)} to Drive folder`)
          
          const filePath = path.join(this.readSetting('driveFolder'), file.new)
          
          fs.copyFileSync(
            newPath,
            filePath
          )
          
          logs.info(`File uploaded to ${chalk.cyan(filePath)} `, '|    |')
        }
      })
    }
  }
  
  private async promptRenameQuestions (filesList: string[]): Promise<VideoRenameAnswers> {
    return inquirer.prompt([
      {
        name: 'video_number',
        message: `Specify the ${chalk.bold.green('video number')} of the ${chalk.bold.green('video')} ------------------:`,
        type: 'number',
        default: DriveFiles.getVideoNumber(this.moduleSettings.driveFolder),
        validate: (input: number) => {
          if (!input || Number.isNaN(+input)) {
            // Pass the return value in the done callback
            return 'You need to provide a video number'
          } else {
            return true
          }
        }
      },
      {
        name: 'video_part_number',
        message: `Indica la ${chalk.bold.green('parte')} del ${chalk.bold.green('video')}.\n  ${chalk.italic('(Scrivere 0 in caso di parte unica)')} ---------:`,
        type: 'number',
        default: DriveFiles.getVideoPart(filesList, this.moduleSettings.multipartFiles, this.moduleSettings.driveFolder),
        transformer: (input: number) => {
          return Number.isNaN(input) ? '' : input
        }
      },
      {
        name: 'lesson_code',
        message: `Indica il ${chalk.bold.green('numero')} della ${chalk.bold.green('lezione')}\n  ${chalk.italic('(Lasciare vuoto in caso non serva)')} ----------:`,
        type: 'number',
        transformer: (input: number) => {
          return Number.isNaN(input) ? '' : input
        }
      },
      {
        name: 'lesson_name',
        message: `Indica il ${chalk.bold.green('titolo')} da assegnare alla ${chalk.bold.green('lezione')} --:`,
        type: 'input',
        validate: (input: string) => {
          if (!input || !input.trim()) {
            // Pass the return value in the done callback
            return 'E\' necessario assegnare un titolo alla lezione'
          } else {
            return true
          }
        }
      }
    ])
  }
  
  private prepareFileNames (videoFiles: string[], answers: VideoRenameAnswers): VideoRenameFileNames[] {
    const toRename: VideoRenameFileNames[] = []
    
    for (let index = 0; index < videoFiles.length; index++) {
      const file = videoFiles[index]
      const newName = this.createVideoFileName(answers, index, videoFiles.length > 1)
      
      toRename.push({
        old: file,
        new: newName,
        formatted: `${chalk.bold.grey(file)} -> ${chalk.bold.green(newName)}`
      })
    }
    
    return toRename
  }
  
  public createVideoFileName (answers: VideoRenameAnswers, index: number, autoIncludePartNumber = false) {
    const { video_number, video_part_number, lesson_code, lesson_name } = answers
    
    const date = new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short'
    })
      .format(new Date())
      .replace(' ', '')
      .toUpperCase()
    
    const newName = []
    let videoNum = [video_number.toString().padStart(2, '0')]
    
    if (video_part_number) {
      videoNum.push((video_part_number + index).toString())
    } else if (autoIncludePartNumber) {
      videoNum.push((index + 1).toString())
    }
    
    newName.push(videoNum.join('_'))
    newName.push(date)
    
    if (lesson_code) {
      newName.push(lesson_code)
    }
    
    newName.push(lesson_name.toLowerCase().replace(/ /g, '_'))
    
    return newName.join('-') + '.mp4'
  }
  
  private createInternalRenameDetails (filesToRename: VideoRenameFileNames[], folder: string) {
    fs.writeFileSync(path.join(folder || '', '.rename.json'), JSON.stringify({
        date: new Date(),
        files: filesToRename
      })
    )
  }
}

