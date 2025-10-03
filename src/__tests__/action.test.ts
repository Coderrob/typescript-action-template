/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed the Apache License, Version 2.0 (the "License");
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

import { Action } from '../core/action.js';
import { ILogger } from '../logging/index.js';

describe('Action', () => {
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
      setFailed: jest.fn(),
      group: jest.fn()
    } as jest.Mocked<ILogger>;
  });

  describe('run', () => {
    it('should run successfully', async () => {
      const action = new Action(mockLogger);
      await action.run();
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Action executed successfully'
      );
    });
  });

  describe('Constructor', () => {
    it('should create an instance with provided logger', () => {
      const action = new Action(mockLogger);
      expect(action).toBeInstanceOf(Action);
    });

    it('should create an instance with default logger', () => {
      const action = new Action();
      expect(action).toBeInstanceOf(Action);
    });
  });
});
