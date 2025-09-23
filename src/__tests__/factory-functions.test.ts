import { jest } from '@jest/globals';
import {
  createCompositeLogger,
  CompositeLogger,
  createPinoLogger,
  PinoLogger
} from '../logging/index.js';

describe('Factory Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create composite logger with default configuration', () => {
    const logger = createCompositeLogger();
    expect(logger).toBeInstanceOf(CompositeLogger);
  });

  it('should create pino logger with default configuration', () => {
    const logger = createPinoLogger();
    expect(logger).toBeInstanceOf(PinoLogger);
  });
});
