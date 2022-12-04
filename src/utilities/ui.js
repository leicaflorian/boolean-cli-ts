const chalk = require('chalk')

const mainLogo = `
   ____              _                     ____ _     ___
  | __ )  ___   ___ | | ___  __ _ _ __    / ___| |   |_ _|
  |  _ \\ / _ \\ / _ \\| |/ _ \\/ _\` | '_ \\  | |   | |    | |
  | |_) | (_) | (_) | |  __/ (_| | | | | | |___| |___ | |
  |____/ \\___/ \\___/|_|\\___|\\__,_|_| |_|  \\____|_____|___|
  `

/**
 * Write the main ASCII logo in console
 */
export function writeMainLogo () {
  // clear the console before writing the logo
  // clear()
  
  console.log(chalk.yellow(mainLogo))
}

/**
 * Write a message in console as a title and adds a few formattings
 * @param {string} section
 *
 * @example
 * ************************* Scaffold *************************
 * @example
 * ********************** video renamer **********************
 */
export function writeSection (section) {
  const length = 60
  const sectionTitle = ` ${section.trim()} `
  const padLength = (length - sectionTitle.length) / 2
  const padText = '*'.repeat(padLength)
  const text = padText + sectionTitle + padText
  
  // console.log(text.length)
  console.log('\n', text, '\n')
}
