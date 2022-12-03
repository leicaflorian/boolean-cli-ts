import { Command } from 'commander'

export default abstract class BasicCommand<Module> {
  protected command: Command
  protected module: Module
  
  /**
   * Register the command to the program.
   * @param program
   */
  abstract register (program: Command): void
  
  /**
   * Handle the command action.
   *
   * @param args
   * @protected
   */
  protected abstract action (...args: any[]): void
  
}
