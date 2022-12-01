import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore
import * as Mustache from 'mustache'

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
function prepareFileName (name: string, extension: string, defaultName: string = null) {
  let fileName = name ?? defaultName ?? ''
  
  if (!fileName.endsWith('.' + extension)) {
    fileName += '.' + extension
  }
  
  return fileName
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

export {
  readTemplate,
  makeFolder,
  prepareFileName,
  getPath,
  getFolderFiles
}
