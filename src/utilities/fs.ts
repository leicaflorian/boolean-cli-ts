import * as path from 'path'
import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import * as Mustache from 'mustache'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import { startCase } from 'lodash'

/**
 * Reaad a template and render it with mustache syntax and data
 *
 * @param {string} file
 * @param {{}} data
 *
 * @return {string}
 */
function readTemplate (file: string, data = {}) {
  const templatePath = path.resolve(__dirname, '../templates/' + file)
  let tmpl = fs.readFileSync(templatePath, 'utf-8')
  
  if (data) {
    tmpl = Mustache.render(tmpl, data)
  }
  
  return tmpl
}

/**
 * Create a folder if this does not exist
 *
 * @param {string} folder
 */
function makeFolder (folder: string): void | string {
  if (!folder) {
    return
  }
  
  const folderPath = path.resolve(folder)
  
  fsExtra.ensureDirSync(folderPath)
  
  return folderPath
}

/**
 * Return a file name with extension
 * and eventually a full path if "dir" argument is provided
 *
 * @param {string} name
 * @param {string} extension
 * @param {string|null} defaultName
 * @param {string} [dir]
 * @return {string}
 */
function prepareFileName (name: string, extension: string, defaultName: string = null, dir?: string): string {
  let fileName = name ?? defaultName ?? ''
  
  if (!fileName.endsWith('.' + extension)) {
    fileName += '.' + extension
  }
  
  if (dir) {
    fileName = path.resolve(dir, fileName)
  }
  
  return fileName
}

/**
 * Based on a file name, return a formatted title
 *
 * @param {string} dest
 * @param {string} fileName
 * @return {string}
 */
function prepareTitle (dest?: string, fileName?: string): string {
  const toReturn = []
  const folderName = getWorkingFolderName(dest)
  
  toReturn.push(startCase(folderName))
  
  if (fileName) {
    toReturn.push(startCase(fileName))
  }
  
  return toReturn.join(' | ')
}

/**
 * Resolve a path and return the absolute path
 * @param {string[]} pathSections
 * @return {string}
 */
function getPath (...pathSections: string[]): string {
  return path.resolve(...pathSections)
}

/**
 * Get all files from a folder
 * @param {string} folder
 * @param {string} extension
 * @return {string[]}
 */
function getFolderFiles (folder: string, extension: string = null): string[] {
  return fs.readdirSync(folder).reduce((acc, file) => {
    const ext = path.extname(file)
    
    if (!extension || (extension && ext === extension)) {
      acc.push(file)
    }
    
    return acc
  }, [])
}

/**
 * Get the name of the folder where the command was executed
 * If a dir is provided, returns it
 * @param dir
 * @return {string}
 */
function getWorkingFolderName (dir?: string): string {
  return dir ?? path.basename(process.cwd())
}

/**
 * Copy a file from the templates folder to the destination
 * @param {string} from - Origin file name
 * @param {string} to - Destination file name
 * @param {string} destination - Destination path
 */
async function copyFromTemplates (from: string, to: string, destination: string = '') {
  const fromPath = path.resolve(__dirname, '../templates/' + from)
  const destPath = path.resolve(destination, to)
  
  // TODO:: log that the file was overwritten
  fsExtra.copySync(fromPath, destPath, {
    overwrite: await askIfOverwrite(destPath)
  })
}

/**
 * Copy each file from a folder from templates folder to the destination
 * @param {string} from - Origin folder name
 * @param {string} to - Destination folder name
 * @param {string} destination - Destination path
 * @return {Promise<string[]>}
 */
async function copyFolderFromTemplates (from: string, to: string, destination: string = ''): Promise<string[]> {
  const fromPath = path.resolve(__dirname, '../templates/' + from)
  const filesList = fs.readdirSync(fromPath)
  
  const copiedFiles: string[] = []
  
  await Promise.all(filesList.map(async (file) => {
      const toPath = to + '/' + file
      
      copiedFiles.push(toPath)
      
      return copyFromTemplates(from + '/' + file, toPath, destination)
    })
  )
  
  return copiedFiles
}

/**
 * Create and write content to a file while checking if the file already exists
 * If so, ask the user if he wants to overwrite it
 *
 * @param {string} fileName
 * @param {string} content
 * @param {string} [destination]
 * @return {Promise<void>}
 */
async function writeToFile (fileName: string, content: string, destination = ''): Promise<boolean> {
  const destPath = path.resolve(destination, fileName)
  
  // if necessary ask user if he wants to overwrite the file
  const eventuallyOverwrite = await askIfOverwrite(destPath)
  
  if (eventuallyOverwrite) {
    // TODO:: log that the file was overwritten
    fsExtra.outputFileSync(destPath, content)
    
    return true
  } else {
    return false
  }
}

/**
 * Ask the user if he wants to overwrite a file
 * @param {string} destPath - File path
 * @return {Promise<boolean>}
 */
async function askIfOverwrite (destPath: string): Promise<boolean> {
  // if the file already exists, ask the user if he wants to overwrite it
  if (fs.existsSync(destPath)) {
    const result = await inquirer.prompt({
      type: 'confirm',
      name: 'overwrite',
      message: `File '${chalk.red(destPath)}' already exists. Do you want to overwrite it?`
    })
    
    return result.overwrite
  }
  
  // if the file does not exist, return true
  return true
}

export {
  readTemplate,
  makeFolder,
  prepareFileName,
  prepareTitle,
  getPath,
  getFolderFiles,
  getWorkingFolderName,
  copyFromTemplates,
  copyFolderFromTemplates,
  writeToFile
}
