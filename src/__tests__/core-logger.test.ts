import { jest } from '@jest/globals';
import { CoreLogger, CoreFunctions } from '../logging/index.js';

describe('CoreLogger', () => {
  let logger: CoreLogger;
  let mockCoreFunctions: jest.Mocked<CoreFunctions>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockCoreFunctions = {
      info: jest.fn(),
      debug: jest.fn(),
      notice: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
      setFailed: jest.fn(),
      startGroup: jest.fn(),
      endGroup: jest.fn()
    };

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

      expect(mockCoreFunctions.startGroup).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.startGroup).toHaveBeenCalledWith('test group');
      expect(mockCoreFunctions.endGroup).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe('result');
    });
  });
});
