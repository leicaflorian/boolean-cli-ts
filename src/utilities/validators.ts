export function stringValidator (str?: string) {
  if (!str || !str.trim()) {
    return 'Please enter a value'
  }
  
  return true
}

export function choicesValidator (choices: any) {
  if (!choices || !Object.keys(choices).length) {
    return 'Please choose at least one option'
  }
  
  return true
}
