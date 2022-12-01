import { getFolderFiles } from '../utilities/fs'

export class DriveFiles {
  /**
   *
   * @param {string} file
   * @return {{videoNum: number, videoPart: number, lessonNum: number, date: string, fileName: string}}
   */
  static parseVideoFileName (file: string) {
    // 4 blocks = video_num - date - lesson_num - file_name
    // 3 blocks = video_num - date - file_name
    const blocks = file.split('-')
    
    const videoNum = {
      num: blocks[0].split('_')[0],
      part: blocks[0].split('_')[1] ?? null
    }
    
    const date = blocks[1]
    const lessonNum = blocks.length === 4 ? blocks[2] : null
    const fileName = blocks.length === 4 ? blocks[3] : blocks[2]
    
    return {
      videoNum: +videoNum.num,
      videoPart: videoNum.part ? +videoNum.part : null,
      lessonNum: lessonNum ? +lessonNum : null,
      date,
      fileName
    }
  }
  
  /**
   * Get the last file uploaded to Google Drive folder
   *
   * @returns {string|null}
   */
  static getLastRemoteFile (driveFolder: string): string | null {
    let toReturn = null
    
    if (!driveFolder) {
      return toReturn
    }
    
    // read video files from the remote folder
    const videoFiles = getFolderFiles(driveFolder, '.mp4')
    
    // get the last file
    if (videoFiles.length > 0) {
      toReturn = videoFiles[videoFiles.length - 1]
    }
    
    return toReturn
  }
  
  static getVideoNumber (driveFolder: string) {
    let toReturn = 0
    
    const lastFile = this.getLastRemoteFile(driveFolder)
    
    if (lastFile) {
      const fileData = this.parseVideoFileName(lastFile)
      
      toReturn = fileData.videoNum + 1
      
      if (fileData.videoPart === 1) {
        toReturn = fileData.videoNum
      }
    }
    
    return toReturn ? +toReturn : 1
  }
  
  static getVideoPart (videoFiles: string[], multipart: boolean, driveFolder: string) {
    let toReturn = videoFiles.length <= 1 || !multipart ? null : 1
    
    // if multipart options is false, avoid calculating the part
    if (!multipart) {
      return toReturn
    }
    
    const lastFile = this.getLastRemoteFile(driveFolder)
    
    if (lastFile) {
      const fileData = this.parseVideoFileName(lastFile)
      
      toReturn = fileData.videoPart === 1 ? 2 : 1
    }
    
    return toReturn
  }
}
