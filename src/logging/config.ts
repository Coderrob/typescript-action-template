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

import * as pino from 'pino';

import { IPinoLoggerConfig } from './pino/types.js';

/**
 * Environment-based configuration resolver
 */
export class LoggerConfigResolver {
  /**
   * Resolve configuration from environment variables and defaults
   */
  static resolve(
    overrides: Partial<IPinoLoggerConfig> = {}
  ): IPinoLoggerConfig {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);

    const defaultConfig: IPinoLoggerConfig = {
      level: (process.env.LOG_LEVEL as pino.LevelWithSilent) || 'info',
      prettyPrint: isDevelopment,
      enableCore: isGitHubActions,
      enablePino: true,
      base: {
        service: 'github-action',
        version: process.env.npm_package_version || '1.0.0',
        ...(isGitHubActions && {
          repository: process.env.GITHUB_REPOSITORY,
          workflow: process.env.GITHUB_WORKFLOW,
          runId: process.env.GITHUB_RUN_ID,
          ref: process.env.GITHUB_REF,
          sha: process.env.GITHUB_SHA
        })
      }
    };

    // Production-specific configuration
    if (isProduction) {
      defaultConfig.transport = {
        target: 'pino/file',
        options: {
          destination: process.env.LOG_FILE || './logs/app.log',
          mkdir: true
        }
      };
    } else if (isDevelopment) {
      defaultConfig.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false
        }
      };
    }

    return { ...defaultConfig, ...overrides };
  }

  /**
   * Create Pino options from resolved config
   */
  static toPinoOptions(config: IPinoLoggerConfig): pino.LoggerOptions {
    return {
      level: config.level || 'info',
      transport: config.transport,
      base: config.base || {}
    };
  }
}
