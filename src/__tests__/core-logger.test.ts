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

import { CoreLogger } from '../logging/index.js';

import {
  createMockCoreFunctions,
  expectGroupOperationCalls
} from './test-utils.js';

describe('CoreLogger', () => {
  let logger: CoreLogger;
  let mockCoreFunctions: ReturnType<typeof createMockCoreFunctions>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockCoreFunctions = createMockCoreFunctions();
    logger = new CoreLogger(mockCoreFunctions);
  });

  describe('info', () => {
    it('should call core.info for info method', () => {
      logger.info('test message');
      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.info).toHaveBeenCalledWith('test message');
    });

    it('should call core.notice for info method with metadata', () => {
      logger.info('test message', { title: 'Test Title', file: 'test.ts' });
      expect(mockCoreFunctions.notice).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.notice).toHaveBeenCalledWith('test message', {
        title: 'Test Title',
        file: 'test.ts',
        startLine: undefined
      });
    });
  });

  describe('warning', () => {
    it('should call core.warning with metadata', () => {
      logger.warning('warning message', { title: 'Warning', startLine: 10 });
      expect(mockCoreFunctions.warning).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.warning).toHaveBeenCalledWith(
        'warning message',
        {
          title: 'Warning',
          file: undefined,
          startLine: 10
        }
      );
    });
  });

  describe('group', () => {
    it('should handle group operations', async () => {
      const mockFn = jest
        .fn<() => Promise<string>>()
        .mockResolvedValueOnce('result');
      const result = await logger.group('test group', mockFn);

      expectGroupOperationCalls(mockCoreFunctions, 'test group', mockFn);
      expect(result).toBe('result');
    });
  });
});
