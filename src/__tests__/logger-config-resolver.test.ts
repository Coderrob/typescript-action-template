import { jest } from '@jest/globals';
import {
  LoggerConfigResolver,
  IPinoLoggerConfig,
  LogLevel
} from '../logging/index.js';

describe('LoggerConfigResolver', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('resolve', () => {
    it('should resolve default configuration for development', () => {
      delete process.env.GITHUB_ACTIONS;
      process.env.NODE_ENV = 'development';
      process.env.npm_package_version = '1.0.0';

      const config = LoggerConfigResolver.resolve();

      expect(config.level).toBe(LogLevel.INFO);
      expect(config.prettyPrint).toBe(true);
      expect(config.enableCore).toBe(false);
      expect(config.enablePino).toBe(true);
      expect(config.base).toHaveProperty('service', 'github-action');
      expect(config.base).toHaveProperty('version', '1.0.0');
    });

    it('should resolve configuration for GitHub Actions', () => {
      process.env.NODE_ENV = 'production';
      process.env.GITHUB_ACTIONS = 'true';
      process.env.GITHUB_REPOSITORY = 'owner/repo';
      process.env.GITHUB_WORKFLOW = 'CI';
      process.env.GITHUB_RUN_ID = '123';
      process.env.GITHUB_REF = 'refs/heads/main';
      process.env.GITHUB_SHA = 'abc123';
      process.env.npm_package_version = '1.0.0';

      const config = LoggerConfigResolver.resolve();

      expect(config.enableCore).toBe(true);
      expect(config.base).toHaveProperty('repository', 'owner/repo');
      expect(config.base).toHaveProperty('workflow', 'CI');
      expect(config.base).toHaveProperty('runId', '123');
      expect(config.base).toHaveProperty('ref', 'refs/heads/main');
      expect(config.base).toHaveProperty('sha', 'abc123');
    });

    it('should resolve production configuration', () => {
      process.env.NODE_ENV = 'production';
      process.env.LOG_FILE = '/tmp/app.log';

      const config = LoggerConfigResolver.resolve();

      expect(config.prettyPrint).toBe(false);
      expect(config.transport).toBeDefined();
      expect(config.transport).toHaveProperty('target', 'pino/file');
    });

    it('should apply overrides', () => {
      const overrides: Partial<IPinoLoggerConfig> = {
        level: LogLevel.DEBUG,
        enableCore: true,
        base: { custom: 'value' }
      };

      const config = LoggerConfigResolver.resolve(overrides);

      expect(config.level).toBe(LogLevel.DEBUG);
      expect(config.enableCore).toBe(true);
      expect(config.base).toHaveProperty('custom', 'value');
    });

    it('should respect LOG_LEVEL environment variable', () => {
      process.env.LOG_LEVEL = LogLevel.WARNING;

      const config = LoggerConfigResolver.resolve();

      expect(config.level).toBe(LogLevel.WARNING);
    });
  });

  describe('toPinoOptions', () => {
    it('should create Pino options from config', () => {
      const config: IPinoLoggerConfig = {
        level: LogLevel.DEBUG,
        base: { service: 'test' },
        transport: {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      };

      const pinoOptions = LoggerConfigResolver.toPinoOptions(config);

      expect(pinoOptions.level).toBe(LogLevel.DEBUG);
      expect(pinoOptions.base).toEqual({ service: 'test' });
      expect(pinoOptions.transport).toBeDefined();
    });

    it('should handle minimal config for Pino options', () => {
      const config: IPinoLoggerConfig = {
        level: LogLevel.INFO
      };

      const pinoOptions = LoggerConfigResolver.toPinoOptions(config);

      expect(pinoOptions.level).toBe(LogLevel.INFO);
      expect(pinoOptions.base).toEqual({});
    });
  });
});
