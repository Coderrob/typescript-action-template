import { jest } from '@jest/globals';
import { Action } from './action.js';
import { ILogger } from './logger.js';

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

  it('should run successfully', async () => {
    const action = new Action(mockLogger);
    await action.run();
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Action executed successfully'
    );
  });
});
