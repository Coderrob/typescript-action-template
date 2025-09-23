import { CoreLogger, ILogger } from '../logging/index.js';

/**
 * Represents the main action class that executes the GitHub Action logic.
 */
export class Action {
  private logger: ILogger;

  /**
   * Creates an instance of Action.
   * @param logger - The logger instance to use for logging. Defaults to CoreLogger.
   */
  constructor(logger: ILogger = new CoreLogger()) {
    this.logger = logger;
  }

  /**
   * Runs the action logic.
   * @returns A promise that resolves when the action completes.
   */
  async run(): Promise<void> {
    this.logger.info('Action executed successfully');
  }
}
