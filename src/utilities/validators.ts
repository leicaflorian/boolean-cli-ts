/**
 * Validators for Inquirer.js
 * Requires a string to exist and be non-empty
 * @param {string} str
 */
export function stringValidator (str?: string): string | boolean {
  if (!str || !str.trim()) {
    return 'Please enter a value'
  }
  
  return true
}

/**
 * Validators for Inquirer.js
 * Requires at least one choice to be selected
 * @param {any} choices
 */
export function choicesValidator (choices: any): string | boolean {
  if (!choices || !Object.keys(choices).length) {
    return 'Please choose at least one option'
  }
  
  return true
}
