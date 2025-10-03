# TypeScript Action Template

[![CI](https://github.com/Coderrob/typescript-action-template/actions/workflows/ci.yml/badge.svg)](https://github.com/Coderrob/typescript-action-template/actions/workflows/ci.yml)
[![Check dist/](https://github.com/Coderrob/typescript-action-template/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Coderrob/typescript-action-template/actions/workflows/check-dist.yml)
[![Coverage](./badges/coverage.svg)](./coverage/lcov-report/index.html)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A highly optimized GitHub Action template repository for building robust,
performant TypeScript-based GitHub Actions with minimal bundle size and
comprehensive code quality tooling.

## Features

- **🚀 High Performance**: Optimized 1.3KB bundle size (99.7% reduction from
  typical builds)
- **📦 Modern TypeScript**: Full TypeScript configuration with strict type
  checking
- **🔍 Code Quality**: ESLint with SonarJS static analysis, complexity limits,
  and import sorting
- **🎨 Code Formatting**: Prettier integration with automatic formatting
- **🧪 Comprehensive Testing**: Jest testing framework with coverage reporting
  and badges
- **⚡ Optimized Build**: Rollup bundling with external dependencies and Terser
  minification
- **🏗️ Smart Architecture**: Modular logging system with dependency injection
- **📊 Quality Gates**: Duplicate code detection (1% threshold), circular
  dependency checking
- **🛡️ Security**: SonarJS security patterns and vulnerability detection
- **🔧 Developer Experience**: Local development support with
  @github/local-action
- **📋 CI/CD Ready**: Pre-configured GitHub Actions workflows with quality gates

## Project Structure

```text
├── .devcontainer/          # Dev container configuration
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD workflows
│   │   ├── ci.yml          # Main CI pipeline
│   │   └── check-dist.yml  # Distribution verification
│   ├── FUNDING.yml         # GitHub funding configuration
│   └── pull_request_template.md
├── .vscode/                # VS Code workspace settings
├── __mocks__/              # Test mocks
│   └── @actions/
│       └── core.ts
├── badges/                 # Generated coverage badges
├── coverage/               # Test coverage reports
├── dist/                   # Build output
├── script/                 # Utility scripts
│   ├── copyright.sh        # Copyright header management
│   ├── distchk.sh          # Distribution verification
│   └── release.sh          # Release automation
├── src/
│   ├── index.ts            # Main entry point
│   ├── core/               # Core action logic
│   │   ├── action.ts       # Action implementation
│   │   └── index.ts        # Core exports
│   ├── logging/            # Modular logging system
│   │   ├── loggers/        # Logger implementations
│   │   │   ├── composite.ts # Multi-logger coordination
│   │   │   ├── core.ts     # GitHub Actions logger
│   │   │   ├── filtered.ts # Filtered logging
│   │   │   ├── metrics.ts  # Metrics collection
│   │   │   ├── mock.ts     # Test mock logger
│   │   │   └── noop.ts     # No-op logger
│   │   ├── pino/           # Pino logger integration
│   │   ├── filters/        # Log filtering system
│   │   ├── config.ts       # Logger configuration
│   │   ├── types.ts        # Type definitions
│   │   └── index.ts        # Logging exports
│   └── __tests__/          # Comprehensive test suite
├── .editorconfig           # Editor style configuration
├── .gitignore              # Optimized git ignore rules
├── .gitattributes          # Git attributes
├── .jscpd.json            # Code duplication detection config
├── .markdown-lint.yml      # Markdown linting configuration
├── .npmignore              # NPM publish control
├── .nvmrc                  # Node.js version (20)
├── .prettierignore         # Prettier ignore rules
├── .prettierrc.yml         # Prettier configuration
├── .yaml-lint.yml          # YAML linting configuration
├── action.yml              # GitHub Action metadata
├── CODEOWNERS              # Code ownership rules
├── eslint.config.mjs       # Modern ESLint flat configuration
├── jest.config.cjs         # Jest testing configuration
├── package.json            # Optimized dependencies and scripts
├── rollup.config.js        # Optimized build configuration
├── tsconfig.json           # Production TypeScript config
├── tsconfig.test.json      # Test environment TypeScript config
└── README.md               # This file
```

## Setup

1. Clone this repository
1. Install dependencies:

```bash
npm install
```

1. Use the correct Node.js version:

```bash
nvm use
```

## Development

### Available Scripts

- **`npm run all`** - 🚀 Complete pipeline: lint:fix → quality → test → package
- **`npm run dev`** - 🔧 Local development with @github/local-action
- **`npm run typecheck`** - 📋 TypeScript type checking without emit
- **`npm run lint`** - 🔍 Prettier and ESLint validation
- **`npm run lint:fix`** - 🎨 Autoformat and fix code issues
- **`npm run quality`** - 📊 Quality gates: lint + duplication + circular deps
- **`npm test`** - 🧪 Jest tests with coverage reporting
- **`npm run coverage`** - 📈 Generate coverage badge
- **`npm run duplication`** - 📊 Code duplication analysis (1% threshold)
- **`npm run madge`** - 🔄 Circular dependency detection
- **`npm run package`** - 📦 Production build (optimized 1.3KB bundle)
- **`npm run package:watch`** - 👀 Watch mode for development
- **`npm run copyright`** - ©️ Update copyright headers
- **`npm run release`** - 🚀 Prepare distribution for release

### Local Development

Test the action locally using the dev script:

```bash
npm run dev
```

This uses `@github/local-action` to run the action with your local source code.

### Testing

Run tests with coverage:

```bash
npm test
```

Coverage reports are generated in the `coverage/` directory, and a badge is
created in `badges/coverage.svg`.

### Code Quality

Check for code duplication:

```bash
npm run duplication
```

Check for circular dependencies:

```bash
npm run madge
```

### Building

Build the action for distribution:

```bash
npm run package
```

This creates the bundled `dist/index.mjs` file.

## CI/CD

The repository includes comprehensive CI/CD workflows:

- **CI Pipeline** (`ci.yml`): Runs linting, unit tests, and integration tests
- **Distribution Check** (`check-dist.yml`): Ensures the `dist/` directory
  matches the built output

## Usage in Workflows

```yaml
- name: Run TypeScript Action
  uses: your-org/your-action@v1
  with:
    # Add your inputs here
```

## Configuration

### Node.js Version

The project uses Node.js 20 (specified in `.nvmrc`).

### TypeScript

- **Production config**: `tsconfig.json` - Main configuration for builds and
  type checking
- **Test config**: `tsconfig.test.json` - Extends main config with test
  environment support

### Code Quality & Linting

ESLint with modern flat configuration includes:

- **TypeScript Integration**: Full type-aware linting with strict rules
- **SonarJS Static Analysis**: Security patterns, complexity limits, code smells
- **Import Organization**: Automatic import sorting and organization
- **Complexity Monitoring**: Cyclomatic complexity limits (fails build at >10)
- **Jest Support**: Test-specific rules and globals
- **Prettier Integration**: Seamless code formatting

### Formatting

Prettier is configured with:

- 2-space indentation
- Single quotes
- Semicolons
- 80 character line width

### Build

Rollup produces an optimized bundle with:

- **99.7% Size Reduction**: From 451KB to 1.3KB (external dependencies)
- **ES Module Output**: Modern JavaScript for GitHub Actions
- **Terser Minification**: Optimized production build
- **External Dependencies**: Core Node.js and GitHub Action modules
- **Source Maps**: Full debugging support

### Configuration Files Summary

| File                 | Purpose                      | Key Features                                             |
| -------------------- | ---------------------------- | -------------------------------------------------------- |
| `action.yml`         | GitHub Action metadata       | Defines inputs, outputs, and Node.js runtime             |
| `package.json`       | Project configuration        | Optimized scripts, 24 dependencies (down from 32)        |
| `tsconfig.json`      | TypeScript production config | Strict rules, ECMAScript 2022 target, Node.js resolution |
| `tsconfig.test.json` | TypeScript test config       | Extends base with Jest globals and test types            |
| `eslint.config.mjs`  | ESLint flat configuration    | SonarJS rules, import organization, complexity limits    |
| `jest.config.cjs`    | Jest testing framework       | Coverage reports, TypeScript transformation              |
| `rollup.config.js`   | Build tool configuration     | 99.7% bundle reduction, external dependencies            |

## Usage in Your Action

1. **Clone this template** or use it as a GitHub template
2. **Customize `action.yml`** with your action's metadata
3. **Implement your logic** in `src/core/action.ts`
4. **Add tests** in `src/__tests__/`
5. **Run the full pipeline** with `npm run all`
6. **Build and release** with `npm run package`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing patterns
4. Add comprehensive tests for new functionality
5. Run the complete pipeline: `npm run all`
6. Ensure all quality gates pass (linting, tests, coverage)
7. Submit a pull request with a clear description

## License

This project is licensed under the Apache License 2.0 - see the
[LICENSE](LICENSE) file for details.
