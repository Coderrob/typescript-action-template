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

import * as core from '@actions/core';

/**
 * Interface for logging operations in GitHub Actions.
 */
export interface ILogger {
  /**
   * Logs an informational message.
   * @param message - The message to log.
   */
  info(message: string): void;

  /**
   * Logs a debug message.
   * @param message - The message to log.
   */
  debug(message: string): void;

  /**
   * Logs a warning message.
   * @param message - The message to log.
   */
  warning(message: string): void;

  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  error(message: string): void;

  /**
   * Sets the action as failed with the given message.
   * @param message - The failure message.
   */
  setFailed(message: string): void;

  /**
   * Logs a group of messages.
   * @param name - The name of the group.
   * @param fn - The function to execute within the group.
   */
  group<T>(name: string, fn: () => Promise<T>): Promise<T>;
}

/**
 * Implementation of ILogger that wraps @actions/core logging functions.
 */
export class CoreLogger implements ILogger {
  info(message: string): void {
    core.info(message);
  }

  debug(message: string): void {
    core.debug(message);
  }

  warning(message: string): void {
    core.warning(message);
  }

  error(message: string): void {
    core.error(message);
  }

  setFailed(message: string): void {
    core.setFailed(message);
  }

  async group<T>(name: string, fn: () => Promise<T>): Promise<T> {
    core.startGroup(name);
    try {
      return await fn();
    } finally {
      core.endGroup();
    }
  }
}
