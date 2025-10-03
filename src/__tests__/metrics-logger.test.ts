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

import { jest } from '@jest/globals';

import {
  ILogMetadata,
  LogLevel,
  MetricsLogger,
  MockLogger
} from '../logging/index.js';

describe('MetricsLogger', () => {
  let mockLogger: MockLogger;
  let metricsLogger: MetricsLogger;
  let metricsCallback: jest.Mock;

  beforeEach(() => {
    mockLogger = new MockLogger();
    metricsCallback = jest.fn();
    metricsLogger = new MetricsLogger(mockLogger, metricsCallback);
  });

  describe('info', () => {
    it('should record metrics for info logs', () => {
      metricsLogger.info('test message');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.totalLogs).toBe(1);
      expect(metrics.infoLogs).toBe(1);
      expect(metrics.logsByLevel[LogLevel.INFO]).toBe(1);
      expect(metricsCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('debug', () => {
    it('should record metrics for debug logs', () => {
      metricsLogger.debug('debug message');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.totalLogs).toBe(1);
      expect(metrics.debugLogs).toBe(1);
      expect(metrics.logsByLevel[LogLevel.DEBUG]).toBe(1);
    });
  });

  describe('warning', () => {
    it('should record metrics for warning logs', () => {
      const metadata: ILogMetadata = { title: 'Warning' };
      metricsLogger.warning('warning message', metadata);

      const metrics = metricsLogger.getMetrics();
      expect(metrics.totalLogs).toBe(1);
      expect(metrics.warnings).toBe(1);
      expect(metrics.warningLogs).toBe(1);
      expect(metrics.logsByLevel[LogLevel.WARNING]).toBe(1);
    });
  });

  describe('error', () => {
    it('should record metrics for error logs', () => {
      metricsLogger.error('error message');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.totalLogs).toBe(1);
      expect(metrics.errors).toBe(1);
      expect(metrics.errorLogs).toBe(1);
      expect(metrics.logsByLevel[LogLevel.ERROR]).toBe(1);
    });
  });

  describe('setFailed', () => {
    it('should record metrics for failed logs', () => {
      metricsLogger.setFailed('failure message');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.totalLogs).toBe(1);
      expect(metrics.failedLogs).toBe(1);
      expect(metrics.logsByLevel[LogLevel.FAILED]).toBe(1);
    });
  });

  describe('group', () => {
    it('should record grouped operations', async () => {
      const mockFn = jest
        .fn<() => Promise<string>>()
        .mockResolvedValue('result');
      await metricsLogger.group('test group', mockFn);

      const metrics = metricsLogger.getMetrics();
      expect(metrics.groupedOperations).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should calculate average log size', () => {
      metricsLogger.info('short');
      metricsLogger.info('this is a longer message');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.averageLogSize).toBeGreaterThan(0);
      expect(metrics.totalLogs).toBe(2);
    });

    it('should calculate logs per minute', () => {
      // Mock Date.now to control timing
      let time = 1000000000;
      jest.spyOn(Date, 'now').mockImplementation(() => time);

      metricsLogger.info('first');
      time += 60000; // 1 minute later
      metricsLogger.info('second');

      const metrics = metricsLogger.getMetrics();
      expect(metrics.logsPerMinute).toBe(2);
      expect(metrics.logRate).toBe(2 / 60); // logs per second

      jest.spyOn(Date, 'now').mockRestore();
    });

    it('should track uptime', () => {
      // Add a small delay to ensure uptime > 0
      const startTime = Date.now();
      while (Date.now() - startTime < 1) {
        // Busy wait for 1ms
      }
      const metrics = metricsLogger.getMetrics();
      expect(metrics.uptime).toBeGreaterThan(0);
    });

    it('should provide metrics snapshot', () => {
      metricsLogger.info('test');
      const metrics = metricsLogger.getMetrics();

      expect(metrics).toHaveProperty('totalLogs', 1);
      expect(metrics).toHaveProperty('logsByLevel');
      expect(metrics).toHaveProperty('uptime');
      expect(metrics).toHaveProperty('lastUpdated');
    });

    it('should handle metadata in metrics', () => {
      const metadata: ILogMetadata = { title: 'Test', file: 'test.ts' };
      metricsLogger.info('message', metadata);

      const metrics = metricsLogger.getMetrics();
      expect(metrics.averageLogSize).toBeGreaterThan(6); // "message" + metadata size
    });
  });

  describe('startMetricsReporting', () => {
    it('should start metrics reporting', () => {
      jest.useFakeTimers();

      const stopReporting = metricsLogger.startMetricsReporting(1000);

      jest.advanceTimersByTime(1000);
      expect(metricsCallback).toHaveBeenCalledTimes(1);

      stopReporting();
      jest.useRealTimers();
    });
  });

  it('should delegate to wrapped logger', () => {
    metricsLogger.info('test message');
    expect(() =>
      mockLogger.assertCalled(LogLevel.INFO, 'test message')
    ).not.toThrow();
  });
});
