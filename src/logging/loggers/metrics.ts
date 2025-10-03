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

import { ILogger, ILoggerMetrics, ILogMetadata } from '../types.js';

/**
 * Logger wrapper that collects metrics and telemetry
 */
export class MetricsLogger implements ILogger {
  private startTime = Date.now();
  private metrics: ILoggerMetrics = {
    totalLogs: 0,
    logsByLevel: {},
    errors: 0,
    warnings: 0,
    logRate: 0,
    lastUpdated: Date.now(),
    infoLogs: 0,
    debugLogs: 0,
    warningLogs: 0,
    errorLogs: 0,
    failedLogs: 0,
    groupedOperations: 0,
    logsPerMinute: 0,
    peakLogsPerMinute: 0,
    averageLogSize: 0,
    uptime: 0
  };
  private totalLogSize = 0;

  constructor(
    private wrappedLogger: ILogger,
    private metricsCallback?: (metrics: ILoggerMetrics) => void
  ) {}

  /**
   * Logs an informational message and updates metrics.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  info(message: string, metadata?: ILogMetadata): void {
    this.recordLog('info', message, metadata);
    this.wrappedLogger.info(message, metadata);
  }

  /**
   * Logs a debug message and updates metrics.
   * @param message - The message to log.
   */
  debug(message: string): void {
    this.recordLog('debug', message);
    this.wrappedLogger.debug(message);
  }

  /**
   * Logs a warning message and updates metrics.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  warning(message: string, metadata?: ILogMetadata): void {
    this.recordLog('warning', message, metadata);
    this.wrappedLogger.warning(message, metadata);
  }

  /**
   * Logs an error message and updates metrics.
   * @param message - The message to log.
   * @param metadata - Optional metadata to include with the log.
   */
  error(message: string, metadata?: ILogMetadata): void {
    this.recordLog('error', message, metadata);
    this.wrappedLogger.error(message, metadata);
  }

  /**
   * Logs a failure message and updates metrics.
   * @param message - The failure message.
   * @param metadata - Optional metadata to include with the failure.
   */
  setFailed(message: string, metadata?: ILogMetadata): void {
    this.recordLog('setFailed', message, metadata);
    this.wrappedLogger.setFailed(message, metadata);
  }

  /**
   * Executes a grouped operation and tracks metrics.
   * @param name - The name of the group.
   * @param fn - The function to execute within the group.
   * @returns A promise that resolves when the group operation completes.
   */
  async group<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.metrics.groupedOperations++;
    this.updateMetrics();
    return this.wrappedLogger.group(name, fn);
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): ILoggerMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Start periodic metrics reporting
   */
  startMetricsReporting(intervalMs: number = 60000): () => void {
    const interval = setInterval(() => {
      // This would typically send metrics somewhere, but for now just update
      this.updateMetrics();
    }, intervalMs);

    return () => clearInterval(interval);
  }

  /**
   * Records a log entry and updates metrics accordingly.
   * @param level - The log level (e.g., 'info', 'error').
   * @param message - The log message.
   * @param metadata - Optional metadata associated with the log.
   */
  private recordLog(
    level: string,
    message?: string,
    metadata?: ILogMetadata
  ): void {
    this.metrics.totalLogs++;
    this.metrics.logsByLevel[level] =
      (this.metrics.logsByLevel[level] || 0) + 1;

    // Calculate log size
    const logSize =
      (message?.length || 0) + (metadata ? JSON.stringify(metadata).length : 0);
    this.totalLogSize += logSize;

    this.updateLevelMetrics(level);

    if (!this.metrics.firstLogTime) {
      this.metrics.firstLogTime = Date.now();
    }
    this.metrics.lastLogTime = Date.now();
    this.updateMetrics();
  }

  /**
   * Updates metrics specific to the log level.
   * @param level - The log level.
   */
  private updateLevelMetrics(level: string): void {
    switch (level) {
      case 'info':
        this.metrics.infoLogs++;
        break;
      case 'debug':
        this.metrics.debugLogs++;
        break;
      case 'warning':
        this.metrics.warnings++;
        this.metrics.warningLogs++;
        break;
      case 'error':
        this.metrics.errors++;
        this.metrics.errorLogs++;
        break;
      case 'setFailed':
        this.metrics.failedLogs++;
        break;
    }
  }

  /**
   * Updates overall metrics such as uptime, log rates, and averages.
   */
  private updateMetrics(): void {
    const now = Date.now();
    this.metrics.lastUpdated = now;
    this.metrics.uptime = now - this.startTime;

    if (this.metrics.totalLogs > 0) {
      this.metrics.averageLogSize = this.totalLogSize / this.metrics.totalLogs;
    }

    if (this.metrics.firstLogTime) {
      const durationMinutes = (now - this.metrics.firstLogTime) / (1000 * 60);
      if (durationMinutes > 0) {
        this.metrics.logsPerMinute = this.metrics.totalLogs / durationMinutes;
        this.metrics.peakLogsPerMinute = Math.max(
          this.metrics.peakLogsPerMinute,
          this.metrics.logsPerMinute
        );
      }
    }

    // Update legacy fields for backward compatibility
    this.metrics.logRate = this.metrics.logsPerMinute / 60; // logs per second

    // Call the metrics callback if provided
    this.metricsCallback?.(this.metrics);
  }
}
