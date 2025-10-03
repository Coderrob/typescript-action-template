// See: https://jestjs.io/docs/configuration

/** @type {import('@jest/types').Config.InitialOptions} **/
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '__mocks__',
    '/node_modules/',
    '/dist/',
    '/tests/'
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 40,
      lines: 60,
      statements: 60
    }
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  preset: 'ts-jest',
  reporters: ['default'],
  setupFilesAfterEnv: [],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/__mocks__/'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      { tsconfig: 'tsconfig.test.json', useESM: true, injectGlobals: true }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!@jest/)',
    '.*\\.(spec|test)\\.(js|jsx)$'
  ],
  verbose: true
};
