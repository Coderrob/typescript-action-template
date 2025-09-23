# Project Organization Guidelines

## Directory Structure

```text
typescript-action-template/
├── .automation/          # Project documentation and standards
├── .github/
│   ├── workflows/        # GitHub Actions CI/CD workflows
│   │   ├── ci.yml        # Main CI pipeline (lint, test, build)
│   │   ├── check-dist.yml # Distribution verification
│   ├── FUNDING.yml       # GitHub funding configuration
│   └── pull_request_template.md
├── __mocks__/            # Jest mocks for external dependencies
│   └── @actions/         # GitHub Actions core mocks
├── badges/               # Generated coverage and quality badges
├── coverage/             # Test coverage reports (lcov, html)
├── dist/                 # Built distribution files (committed)
├── script/               # Build and maintenance scripts
│   ├── copyright.sh      # Copyright header management
│   ├── distchk.sh        # Distribution verification
│   └── release.sh        # Release automation
├── src/                  # Source code
│   ├── index.ts          # Main entry point
│   ├── core/             # Core GitHub Action functionality
│   │   ├── action.ts     # Main action logic
│   │   └── index.ts      # Core exports
│   ├── logging/          # Comprehensive logging system
│   │   ├── index.ts      # Logging system exports
│   │   ├── config.ts     # Configuration resolver
│   │   ├── types.ts      # TypeScript type definitions
│   │   ├── filters/      # Log filtering and sampling
│   │   │   ├── index.ts
│   │   │   ├── log-filters.ts    # Common filter functions
│   │   │   └── filtered-logger.ts # Filtering logger wrapper
│   │   ├── loggers/      # Logger implementations
│   │   │   ├── index.ts
│   │   │   ├── composite.ts      # Multi-logger delegation
│   │   │   ├── core-logger.ts    # GitHub Actions core logger
│   │   │   ├── factory.ts        # Logger factory functions
│   │   │   ├── metrics.ts        # Metrics collection logger
│   │   │   ├── mock.ts           # Testing mock logger
│   │   │   └── noop.ts           # No-op fallback logger
│   │   ├── pino/         # Pino structured logging
│   │   │   ├── index.ts
│   │   │   ├── logger.ts         # Pino logger implementation
│   │   │   └── types.ts          # Pino-specific types
│   │   └── mocks/        # Testing utilities
│   ├── tests/            # Test files (Jest configuration)
│   └── types/            # Global type definitions
│       ├── index.ts
│       └── logger.ts     # Logger interface definitions
├── types/                # Additional type definitions
├── action.yml            # GitHub Action metadata
├── CODEOWNERS            # Code ownership rules
├── eslint.config.mjs     # ESLint configuration (flat config)
├── jest.config.cjs       # Jest configuration with path mapping
├── package.json          # Node.js dependencies and scripts
├── rollup.config.js      # Build configuration (ES modules)
├── tsconfig.json         # Production TypeScript config
├── tsconfig.test.json    # Test-specific TypeScript config
└── README.md             # Project documentation
```

## Code Organization Principles

### Separation of Concerns

- **Core**: GitHub Action execution logic
- **Logging**: Structured logging system with multiple backends
- **Configuration**: Environment-based configuration resolution
- **Testing**: Comprehensive test utilities and mocks

### Modular Architecture

- Each logger implementation is self-contained
- Filtering, metrics, and mocking are separate concerns
- Factory functions provide clean instantiation APIs

### Type Safety

- Strict TypeScript configuration
- Comprehensive type definitions
- Interface-based design for testability

## File Naming Conventions

### Source Files

- Use kebab-case for filenames: `logger-config.ts`
- Use PascalCase for class names: `LoggerConfigResolver`
- Use camelCase for functions and variables: `resolveConfig`

### Test Files

- Mirror source filenames: `logger.test.ts`
- Use descriptive test names with behavioral language

### Configuration Files

- Use standard naming: `eslint.config.mjs`, `jest.config.cjs`
- Include file extensions for clarity

## Import Organization

### ES Modules

```typescript
// Group imports by type
import type { ILogger } from '../../types/index.js';
import { CoreLogger } from './core-logger.js';
import pino from 'pino';
```

### Barrel Exports

Use index.ts files for clean public APIs:

```typescript
// src/logging/index.ts
export { CoreLogger } from './loggers/core-logger.js';
export { FilteredLogger } from './filters/filtered-logger.js';
// ... other exports
```

## Code Quality Standards

### Complexity Limits

- Maximum cyclomatic complexity: 10
- Functions exceeding this limit are automatically flagged by ESLint
- Refactor complex functions by extracting smaller functions

### Code Duplication

- Maximum duplication: 5%
- Build fails if duplication exceeds threshold
- Use shared utilities and base classes to reduce duplication

### Test Coverage

- Target: 85%+ coverage (currently 93.83%)
- Minimum: 60% (build fails below this)
- Focus on critical paths and error handling
- Coverage badge automatically generated and committed

## Development Workflow

### Local Development

1. Make changes to source code
2. Run tests: `npm test`
3. Check quality: `npm run all`
4. Format code: `npm run lint:fix`
5. Test locally: `npm run dev`

### Available Scripts

- `npm run all` - Full quality check (lint, duplication, test, build)
- `npm test` - Run tests with coverage and badge generation
- `npm run lint` - Check code formatting and ESLint rules
- `npm run lint:fix` - autofix formatting and ESLint issues
- `npm run package` - Build distribution bundle
- `npm run dev` - Test action locally with @github/local-action
- `npm run duplication` - Check for code duplication (< 5%)
- `npm run madge` - Check for circular dependencies
- `npm run copyright` - Update copyright headers
- `npm run coverage` - Generate coverage badge

### Code Review Checklist

- [ ] Tests pass with >60% coverage
- [ ] No ESLint errors or warnings
- [ ] Code duplication <5%
- [ ] Cyclomatic complexity ≤10
- [ ] TypeScript compilation succeeds
- [ ] Documentation updated if needed

### Commit Standards

- Use conventional commit format
- Include test coverage in PR descriptions
- Reference issue numbers when applicable

## Build and Deployment

### Build Process

```bash
npm run all      # Full quality check + build
npm run package  # Create distribution
```

### Quality Gates

All builds must pass:

- ESLint (formatting, complexity)
- Jest (tests, coverage)
- JSCPD (duplication)
- TypeScript compilation

### Distribution

- Built files go to `dist/` directory
- Source maps included for debugging
- Minified for production use

## Maintenance

### Dependency Updates

- Use `npm audit` for security updates
- Test thoroughly after major updates
- Update both dependencies and devDependencies

### Documentation Updates

- Keep `.automation/` docs current
- Update README.md for API changes
- Include examples for new features

### Performance Monitoring

- Monitor test execution time
- Track bundle size changes
- Watch for coverage regressions
