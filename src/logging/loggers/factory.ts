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

import pino from 'pino';

import { PinoLogger } from '../pino/logger.js';
import { LogLevel } from '../types.js';

import { CompositeLogger } from './composite.js';
import { CoreLogger } from './core.js';

/**
 * Factory function to create a CompositeLogger with CoreLogger and PinoLogger.
 * @param pinoOptions - Optional Pino configuration options
 * @returns A CompositeLogger instance with both CoreLogger and PinoLogger
 */
export function createCompositeLogger(
  pinoOptions?: pino.LoggerOptions
): CompositeLogger {
  const coreLogger = new CoreLogger();
  const pinoLogger = new PinoLogger(pinoOptions);
  return new CompositeLogger([coreLogger, pinoLogger]);
}

/**
 * Factory function to create a PinoLogger with default configuration for GitHub Actions.
 * @returns A PinoLogger instance configured for GitHub Actions environment
 */
export function createPinoLogger(): PinoLogger {
  return new PinoLogger({
    level: process.env.LOG_LEVEL || LogLevel.INFO,
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname'
            }
          }
        : undefined,
    base: {
      service: 'github-action',
      version: process.env.npm_package_version || '1.0.0'
    }
  });
}
