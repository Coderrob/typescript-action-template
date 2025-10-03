/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
    return Promise.resolve();
  }
}
