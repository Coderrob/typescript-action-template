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

import { ILogger, ILogMetadata } from '../types.js';

/**
 * CompositeLogger that delegates logging calls to multiple logger providers.
 * This allows for logging to both GitHub Actions console and operational logs simultaneously.
 */
export class CompositeLogger implements ILogger {
  private loggers: ILogger[];

  constructor(loggers: ILogger[]) {
    this.loggers = loggers;
  }

  /**
   * Logs an informational message to all registered loggers.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  info(message: string, metadata?: ILogMetadata): void {
    this.loggers.forEach((logger) => logger.info(message, metadata));
  }

  /**
   * Logs a debug message to all registered loggers.
   * @param message - The message to log.
   */
  debug(message: string): void {
    this.loggers.forEach((logger) => logger.debug(message));
  }

  /**
   * Logs a warning message to all registered loggers.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  warning(message: string, metadata?: ILogMetadata): void {
    this.loggers.forEach((logger) => logger.warning(message, metadata));
  }

  /**
   * Logs an error message to all registered loggers.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  error(message: string, metadata?: ILogMetadata): void {
    this.loggers.forEach((logger) => logger.error(message, metadata));
  }

  /**
   * Sets the action as failed in all registered loggers.
   * @param message - The failure message.
   * @param metadata - Optional metadata to include with the failure.
   */
  setFailed(message: string, metadata?: ILogMetadata): void {
    this.loggers.forEach((logger) => logger.setFailed(message, metadata));
  }

  /**
   * Executes a grouped operation with all registered loggers.
   * The function is executed once and the result is passed to all loggers.
   * @param name - The name of the group.
   * @param fn - The function to execute within the group.
   * @returns A promise that resolves when all group operations complete.
   */
  async group<T>(name: string, fn: () => Promise<T>): Promise<T> {
    // Execute the function once to get the result
    const result = await fn();

    // Execute the group operation with all loggers using the already computed result
    await Promise.allSettled(
      this.loggers.map(async (logger, index) => {
        try {
          return await logger.group(name, async () => result);
        } catch (error) {
          // Log the error but don't let one logger failure break others
          console.warn(
            `Logger group operation failed for logger ${index}:`,
            error
          );
          throw error;
        }
      })
    );

    // Return the result since we already executed fn successfully
    return result;
  }

  /**
   * Add a new logger to the composite.
   * @param logger - The logger to add
   */
  addLogger(logger: ILogger): void {
    this.loggers.push(logger);
  }

  /**
   * Remove a logger from the composite.
   * @param logger - The logger to remove
   */
  removeLogger(logger: ILogger): void {
    const index = this.loggers.indexOf(logger);
    if (index > -1) {
      this.loggers.splice(index, 1);
    }
  }
}
