import { jest } from '@jest/globals';
import {
  CoreLogger,
  FilteredLogger,
  CoreFunctions,
  LogFilters,
  LogLevel,
  ISamplingStrategy
} from '../logging/index.js';

describe('FilteredLogger', () => {
  let logger: CoreLogger;
  let filteredLogger: FilteredLogger;
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
    filteredLogger = new FilteredLogger(logger);
  });

  it('should pass through logs when no filters are applied', () => {
    filteredLogger.info('test message');
    expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
    expect(mockCoreFunctions.info).toHaveBeenCalledWith('test message');
  });

  describe('addFilter', () => {
    it('should apply level filter correctly', () => {
      const levelFilter = LogFilters.levelFilter(LogLevel.WARNING);
      filteredLogger.addFilter(levelFilter);

      filteredLogger.info('info message'); // Should be filtered out
      filteredLogger.warning('warning message'); // Should pass through

      expect(mockCoreFunctions.info).not.toHaveBeenCalled();
      expect(mockCoreFunctions.warning).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.warning).toHaveBeenCalledWith('warning message');
    });

    it('should apply exclude pattern filter', () => {
      const excludeFilter = LogFilters.excludePattern('secret');
      filteredLogger.addFilter(excludeFilter);

      filteredLogger.info('normal message');
      filteredLogger.info('message with secret data');

      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.info).toHaveBeenCalledWith('normal message');
    });

    it('should apply include pattern filter', () => {
      const includeFilter = LogFilters.includePattern(/^important/);
      filteredLogger.addFilter(includeFilter);

      filteredLogger.info('important message'); // Should pass
      filteredLogger.info('unimportant message'); // Should be filtered out

      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.info).toHaveBeenCalledWith('important message');
    });

    it('should apply metadata filter', () => {
      const metadataFilter = LogFilters.metadataFilter(
        (metadata) => metadata?.title === 'Allowed'
      );
      filteredLogger.addFilter(metadataFilter);

      filteredLogger.info('message1', { title: 'Allowed' });
      filteredLogger.info('message2', { title: 'Blocked' });

      expect(mockCoreFunctions.notice).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.notice).toHaveBeenCalledWith('message1', {
        title: 'Allowed',
        file: undefined,
        startLine: undefined
      });
    });

    it('should apply rate limiting', () => {
      const rateLimitFilter = LogFilters.rateLimit(2);
      filteredLogger.addFilter(rateLimitFilter);

      // These should pass
      filteredLogger.info('message1');
      filteredLogger.info('message2');

      // This should be rate limited
      filteredLogger.info('message3');

      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(2);
    });
  });

  describe('setFailed', () => {
    it('should always log failures regardless of filters', () => {
      const levelFilter = LogFilters.levelFilter(LogLevel.ERROR);
      filteredLogger.addFilter(levelFilter);

      filteredLogger.setFailed('failure message');

      expect(mockCoreFunctions.setFailed).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.setFailed).toHaveBeenCalledWith(
        'failure message'
      );
    });
  });

  describe('setSampling', () => {
    it('should apply sampling strategy', () => {
      const samplingStrategy: ISamplingStrategy = {
        rate: 1.0,
        shouldSample: () => true
      };
      filteredLogger.setSampling(samplingStrategy);

      filteredLogger.info('sampled message');
      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.info).toHaveBeenCalledWith('sampled message');
    });

    it('should not sample when rate is below threshold', () => {
      filteredLogger.setSampling({
        rate: 1.0,
        shouldSample: () => false
      });

      filteredLogger.info('sampled message');
      expect(mockCoreFunctions.info).not.toHaveBeenCalled();
    });

    it('should apply window-based sampling', () => {
      filteredLogger.setSampling({
        rate: 1.0,
        maxPerWindow: 2,
        windowMs: 1000
      });

      filteredLogger.info('message1');
      filteredLogger.info('message2');
      filteredLogger.info('message3'); // Should be blocked

      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearFilters', () => {
    it('should clear filters', () => {
      const levelFilter = LogFilters.levelFilter(LogLevel.ERROR);
      filteredLogger.addFilter(levelFilter);
      filteredLogger.clearFilters();

      filteredLogger.info('should pass now');
      expect(mockCoreFunctions.info).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.info).toHaveBeenCalledWith('should pass now');
    });
  });

  describe('group', () => {
    it('should handle group operations without filtering', async () => {
      const mockFn = jest
        .fn<() => Promise<string>>()
        .mockResolvedValue('result');
      const result = await filteredLogger.group('test group', mockFn);

      expect(mockCoreFunctions.startGroup).toHaveBeenCalledTimes(1);
      expect(mockCoreFunctions.startGroup).toHaveBeenCalledWith('test group');
      expect(mockCoreFunctions.endGroup).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe('result');
    });
  });
});
