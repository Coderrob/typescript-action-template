# Testing Documentation

## Overview

This project uses Jest with ts-jest for comprehensive TypeScript testing. The
test suite covers unit tests, integration tests, and quality assurance checks.

## Test Structure

### Directory Structure

```text
src/
├── core/           # Core functionality tests
│   └── action.test.ts
├── logging/        # Logging system tests
│   ├── config/     # Configuration resolver tests
│   │   └── logger-config-resolver.test.ts
│   ├── filters/    # Log filtering tests
│   │   └── filtered-logger.test.ts
│   ├── loggers/    # Logger implementation tests
│   │   ├── composite-logger.test.ts
│   │   ├── core-logger.test.ts
│   │   ├── factory-functions.test.ts
│   │   ├── metrics-logger.test.ts
│   │   ├── mock-logger.test.ts
│   │   └── pino-logger.test.ts
│   └── pino/       # Pino-specific tests
└── tests/          # Main test suite (legacy location)
```

### Test Categories

#### Unit Tests (76 total tests)

- **Action**: Core GitHub Action execution (1 test)
- **CoreLogger**: GitHub Actions console logging with dependency injection (5
  tests)
- **PinoLogger**: Structured logging with Pino (6 tests)
- **CompositeLogger**: Multi-logger delegation (8 tests)
- **FilteredLogger**: Log filtering and sampling (9 tests)
- **MetricsLogger**: Metrics collection and reporting (7 tests)
- **MockLogger**: Logging assertion utilities (12 tests)
- **LoggerConfigResolver**: Environment-based configuration (6 tests)
- **Factory Functions**: Logger creation utilities (2 tests)

#### Integration Tests

- Factory functions for logger creation
- End-to-end logging workflows
- Configuration resolution from environment
- GitHub Actions integration testing

## Test Coverage Goals

- **Target**: 85%+ coverage across statements, branches, functions, and lines
- **Current**: 93.83% statements (76 tests passing)
- **Quality Gates**:
  - ESLint complexity check: max 10 cyclomatic complexity
  - Code duplication check: max 5% duplication (currently 2%)
  - Build fails if quality gates are not met
  - Coverage badge automatically generated and committed

## Running Tests

### Basic Test Execution

```bash
npm test              # Run all tests with coverage and badge generation
npm run test          # Same as above (alias)
```

### Quality Checks

```bash
# Run all quality checks (recommended for development)
npm run all

# Individual checks
npm run lint          # ESLint + Prettier formatting check
npm run lint:fix      # Auto-fix formatting and ESLint issues
npm run duplication   # Code duplication check (< 5%)
npm run madge         # Circular dependency check
npm run coverage      # Generate coverage badge only
```

### Specific Test Execution

```bash
# Run specific test files
npm test -- src/tests/core-logger.test.ts
npm test -- src/logging/loggers/

# Run tests matching pattern
npm test -- --testNamePattern="CompositeLogger"
npm test -- --testNamePattern="should track uptime"

# Run with verbose output
npm test -- --verbose
```

### Local Development Testing

```bash
# Test the action locally
npm run dev

# Watch mode for development
npm run package:watch  # Build in watch mode
```

## Testing Patterns

### Dependency Injection for Testability

The CoreLogger uses dependency injection to enable testing:

```typescript
const mockCoreFunctions: CoreFunctions = {
  info: jest.fn(),
  debug: jest.fn()
  // ... other functions
};

const logger = new CoreLogger(mockCoreFunctions);
```

### Mock Logger for Assertions

MockLogger captures all log calls for verification:

```typescript
const mockLogger = new MockLogger();
compositeLogger.addLogger(mockLogger);

// Assertions
expect(mockLogger.calls).toHaveLength(1);
expect(mockLogger.calls[0].level).toBe('info');
```

### Environment-Based Configuration Testing

LoggerConfigResolver tests cover different environments:

```typescript
process.env.NODE_ENV = 'production';
process.env.GITHUB_ACTIONS = 'true';
const config = LoggerConfigResolver.resolve();
```

## Test Maintenance

### Adding New Tests

1. Follow existing patterns in `src/tests/logger.test.ts`
2. Use descriptive test names
3. Include edge cases and error scenarios
4. Update coverage expectations

### Coverage Improvement

- Focus on logger implementations (CompositeLogger, PinoLogger)
- Add tests for error handling and edge cases
- Ensure all code paths are exercised

### Quality Gates

- **Complexity**: Functions with complexity > 10 will fail build
- **Duplication**: Code duplication > 5% will fail build
- **Coverage**: Below 60% threshold will fail build

## Troubleshooting

### Common Issues

#### ES Module Mocking

For ES modules, use dependency injection instead of jest.mock():

```typescript
// ❌ Doesn't work well with ES modules
jest.mock('@actions/core');

// ✅ Use dependency injection
const logger = new CoreLogger(mockCoreFunctions);
```

#### Coverage Not Tracking Files

- Ensure files are imported in test files
- Check Jest collectCoverageFrom configuration
- Verify TypeScript compilation includes test files

#### Async Test Timeouts

Use proper async/await patterns:

```typescript
it('should handle async operations', async () => {
  await logger.group('test', async () => {
    // async operations
  });
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions workflows:

### CI Pipeline (`ci.yml`)

- **Trigger**: Pull requests and pushes to main branch
- **Checks**:
  - ESLint code quality and formatting
  - Jest unit tests with coverage reporting
  - Super Linter for additional code quality checks
- **Status**: Must pass for PR merge

### Distribution Check (`check-dist.yml`)

- **Trigger**: Pull requests and pushes to main branch
- **Purpose**: Ensures `dist/` directory matches built output
- **Checks**: Build verification and distribution integrity

### Automated Quality Gates

```yaml
- name: Run Quality Checks
  run: npm run all
```

This includes:

1. Code formatting and linting (ESLint + Prettier)
2. Code duplication analysis (< 5%)
3. Unit test execution with coverage (93.83% target)
4. Build packaging and verification
5. Circular dependency checking
