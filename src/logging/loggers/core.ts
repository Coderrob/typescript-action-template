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

import { ILogger, ILogMetadata } from '../types.js';

/**
 * Core functions interface for dependency injection
 */
export interface CoreFunctions {
  info: (message: string) => void;
  debug: (message: string) => void;
  notice: (message: string, properties?: core.AnnotationProperties) => void;
  warning: (message: string, properties?: core.AnnotationProperties) => void;
  error: (message: string, properties?: core.AnnotationProperties) => void;
  setFailed: (message: string) => void;
  startGroup: (name: string) => void;
  endGroup: () => void;
}

/**
 * Implementation of ILogger that wraps @actions/core logging functions.
 */
export class CoreLogger implements ILogger {
  private core: CoreFunctions;

  /**
   * Creates an instance of CoreLogger.
   * @param coreFunctions - Optional core functions for dependency injection (useful for testing).
   */
  constructor(coreFunctions?: CoreFunctions) {
    this.core = coreFunctions || {
      info: core.info,
      debug: core.debug,
      notice: core.notice,
      warning: core.warning,
      error: core.error,
      setFailed: core.setFailed,
      startGroup: core.startGroup,
      endGroup: core.endGroup
    };
  }

  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  info(message: string, metadata?: ILogMetadata): void {
    if (metadata) {
      // info doesn't support annotations, so we'll use notice instead
      this.core.notice(
        message,
        this.convertMetadataToAnnotationProperties(metadata)
      );
    } else {
      this.core.info(message);
    }
  }

  /**
   * Logs a debug message.
   * @param message - The message to log.
   */
  debug(message: string): void {
    // Debug doesn't support annotations in GitHub Actions
    this.core.debug(message);
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  warning(message: string, metadata?: ILogMetadata): void {
    if (metadata) {
      this.core.warning(
        message,
        this.convertMetadataToAnnotationProperties(metadata)
      );
    } else {
      this.core.warning(message);
    }
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  error(message: string, metadata?: ILogMetadata): void {
    if (metadata) {
      this.core.error(
        message,
        this.convertMetadataToAnnotationProperties(metadata)
      );
    } else {
      this.core.error(message);
    }
  }

  /**
   * Sets the action as failed with the given message.
   * @param message - The failure message.
   * @param metadata - Optional metadata to include with the failure.
   */
  setFailed(message: string, metadata?: ILogMetadata): void {
    if (metadata) {
      this.core.setFailed(message);
      // Create a separate error annotation since setFailed doesn't support annotation properties
      this.core.error(
        message,
        this.convertMetadataToAnnotationProperties(metadata)
      );
    } else {
      this.core.setFailed(message);
    }
  }

  /**
   * Logs a group of messages.
   * @param name - The name of the group.
   * @param fn - The function to execute within the group.
   * @returns A promise that resolves when the group operation completes.
   */
  async group<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.core.startGroup(name);
    try {
      return await fn();
    } finally {
      this.core.endGroup();
    }
  }

  /**
   * Converts ILogMetadata to core.AnnotationProperties.
   * @param metadata - The log metadata.
   * @returns The corresponding annotation properties.
   */
  private convertMetadataToAnnotationProperties(
    metadata: ILogMetadata
  ): core.AnnotationProperties {
    return {
      title: metadata.title,
      file: metadata.file,
      startLine: metadata.startLine,
      endLine: metadata.endLine,
      startColumn: metadata.startColumn,
      endColumn: metadata.endColumn
    };
  }
}
