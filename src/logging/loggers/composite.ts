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
   * Each logger's group wraps the function execution individually.
   * @param name - The name of the group.
   * @param fn - The function to execute within the group.
   * @returns A promise that resolves when all group operations complete.
   */
  async group<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (this.loggers.length === 0) {
      return fn();
    }

    // If there's only one logger, delegate directly
    if (this.loggers.length === 1) {
      return this.loggers[0].group(name, fn);
    }

    // For multiple loggers, execute in parallel but handle errors appropriately
    const results = await Promise.allSettled(
      this.loggers.map(async (logger, index) => {
        try {
          return await logger.group(name, fn);
        } catch (error) {
          console.warn(
            `Logger group operation failed for logger ${index}:`,
            error
          );
          // Re-throw to be handled by Promise.allSettled
          throw error;
        }
      })
    );

    // Analyze results to determine success/failure
    const failures: Array<{ index: number; error: unknown }> = [];
    let successResult: T | undefined;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        // Use the first successful result (they should all be the same)
        if (successResult === undefined) {
          successResult = result.value;
        }
      } else {
        failures.push({ index, error: result.reason });
      }
    });

    // If all loggers failed, throw the first error
    if (failures.length === results.length) {
      console.error('All loggers failed in group operation:', failures);
      throw failures[0].error;
    }

    // If some failed but at least one succeeded, log warnings but continue
    if (failures.length > 0) {
      console.warn(
        `${failures.length} of ${results.length} loggers failed in group operation:`,
        failures
      );
    }

    // Return the successful result
    return successResult as T;
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
