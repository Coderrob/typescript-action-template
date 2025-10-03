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

// Test utilities for shared test functionality

import { jest } from '@jest/globals';

/**
 * Creates a mocked CoreFunctions object for testing
 * @returns A jest-mocked CoreFunctions object
 */
export function createMockCoreFunctions() {
  return {
    info: jest.fn(),
    debug: jest.fn(),
    notice: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    setFailed: jest.fn(),
    startGroup: jest.fn(),
    endGroup: jest.fn()
  };
}

/**
 * Test helper for group operation assertions
 * @param mockCoreFunctions - The mocked core functions
 * @param groupName - Expected group name
 * @param mockFn - The mock function that was executed
 */
export function expectGroupOperationCalls(
  mockCoreFunctions: ReturnType<typeof createMockCoreFunctions>,
  groupName: string,
  mockFn: jest.MockedFunction<any>
): void {
  expect(mockCoreFunctions.startGroup).toHaveBeenCalledTimes(1);
  expect(mockCoreFunctions.startGroup).toHaveBeenCalledWith(groupName);
  expect(mockCoreFunctions.endGroup).toHaveBeenCalledTimes(1);
  expect(mockFn).toHaveBeenCalledTimes(1);
}

/**
 * Creates a mock function that returns a promise resolving to the given value
 * @param returnValue - The value the mock function should resolve to
 * @returns A jest mock function
 */
export function createMockAsyncFunction<T>(
  returnValue: T
): jest.MockedFunction<() => Promise<T>> {
  return jest
    .fn<() => Promise<T>>()
    .mockResolvedValue(returnValue) as jest.MockedFunction<() => Promise<T>>;
}
