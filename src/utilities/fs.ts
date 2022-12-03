import * as path from 'path'
import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
// @ts-ignore
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
function makeFolder (folder: string) {
  if (!folder) {
    return
  }
  
  const cssFolderPath = path.resolve(folder)
  
  if (!fs.existsSync(cssFolderPath)) {
    fs.mkdirSync(cssFolderPath)
  }
}

/**
 *
 * @param {string} name
 * @param {string} extension
 * @param {string|null} defaultName
 */
function prepareFileName (name: string, extension: string, defaultName: string = null, dir?: string) {
  let fileName = name ?? defaultName ?? ''
  
  if (!fileName.endsWith('.' + extension)) {
    fileName += '.' + extension
  }
  
  if (dir) {
    fileName = path.resolve(dir, fileName)
  }
  
  return fileName
}

function prepareTitle (dest?: string, fileName?: string) {
  const toReturn = []
  const folderName = getWorkingFolderName(dest)
  
  toReturn.push(startCase(folderName))
  
  if (fileName) {
    toReturn.push(startCase(fileName))
  }
  
  return toReturn.join(' | ')
}

function getPath (...pathSections: string[]) {
  return path.resolve(...pathSections)
}

/**
 * Get all files from a folder
 * @param {string} folder
 * @param {string} extension
 */
function getFolderFiles (folder: string, extension: string = null) {
  return fs.readdirSync(folder).reduce((acc, file) => {
    const ext = path.extname(file)
    
    if (!extension || (extension && ext === extension)) {
      acc.push(file)
    }
    
    return acc
  }, [])
}

function getWorkingFolderName (dir?: string) {
  return dir ?? path.basename(process.cwd())
}

async function copyFromTemplates (from: string, to: string, destination: string = '') {
  const fromPath = path.resolve(__dirname, '../templates/' + from)
  const destPath = path.resolve(destination, to)
  
  // TODO:: log that the file was overwritten
  fsExtra.copySync(fromPath, destPath, {
    overwrite: await askIfOverwrite(destPath)
  })
}

async function copyFolderFromTemplates (from: string, to: string, destination: string = '') {
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
 */
async function writeToFile (fileName: string, content: string, destination = '') {
  const destPath = path.resolve(destination, fileName)
  const eventuallyOverwrite = await askIfOverwrite(destPath)
  
  if (eventuallyOverwrite) {
    // TODO:: log that the file was overwritten
    fsExtra.outputFileSync(destPath, content)
    
    return true
  } else {
    return false
  }
}

async function askIfOverwrite (destPath: string): Promise<boolean> {
  if (fs.existsSync(destPath)) {
    const result = await inquirer.prompt({
      type: 'confirm',
      name: 'overwrite',
      message: `File '${chalk.red(destPath)}' already exists. Do you want to overwrite it?`
    })
    
    return result.overwrite
  }
  
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
