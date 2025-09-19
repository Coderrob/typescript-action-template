# TypeScript Action Template

A comprehensive GitHub Action template repository for building robust
TypeScript-based GitHub Actions.

## Features

- **TypeScript Support**: Full TypeScript configuration with strict type
  checking
- **ESLint & Prettier**: Code linting and formatting with Prettier integration
- **Jest Testing**: Unit testing framework with coverage reporting and badge
  generation
- **Rollup Build**: Optimized bundling with minification using Terser
- **Dependency Injection**: ILogger abstraction for better testability
- **Code Quality Tools**: Duplicate code detection, circular dependency checking
- **EditorConfig**: Consistent coding styles across editors
- **CI/CD Ready**: Pre-configured GitHub Actions workflows for CI/CD
- **Local Development**: Support for local action testing with
  @github/local-action

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
├── dist/                   # Build output (committed)
├── script/                 # Utility scripts
│   ├── copyright.sh        # Copyright header management
│   ├── distchk.sh          # Distribution verification
│   └── release.sh          # Release automation
├── src/
│   ├── index.ts            # Main entry point
│   ├── action.ts           # Core action logic
│   ├── action.test.ts      # Unit tests
│   └── logger.ts           # Logging abstraction
├── .editorconfig           # Editor style configuration
├── .gitignore              # Git ignore rules
├── .gitattributes          # Git attributes
├── .markdown-lint.yml      # Markdown linting configuration
├── .nvmrc                  # Node.js version specification
├── .prettierignore         # Prettier ignore rules
├── .prettierrc.yml         # Prettier configuration
├── .yaml-lint.yml          # YAML linting configuration
├── action.yml              # GitHub Action metadata
├── CODEOWNERS              # Code ownership rules
├── eslint.config.mjs       # ESLint configuration
├── jest.config.cjs         # Jest configuration
├── package.json            # Project dependencies and scripts
├── rollup.config.js        # Build configuration
├── tsconfig.json           # Production TypeScript config
├── tsconfig.test.json      # Test TypeScript config
└── README.md               # This file
```

## Setup

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Use the correct Node.js version:

   ```bash
   nvm use
   ```

## Development

### Available Scripts

- `npm run lint` - Run ESLint and Prettier checks
- `npm run lint:fix` - Run ESLint with auto-fix and Prettier formatting
- `npm run test` - Run Jest tests with coverage
- `npm run package` - Build the action distribution
- `npm run package:watch` - Build the action in watch mode
- `npm run all` - Run lint, test, and build
- `npm run dev` - Run the action locally for development
- `npm run coverage` - Generate coverage badge
- `npm run duplication` - Check for code duplication
- `npm run madge` - Check for circular dependencies
- `npm run copyright` - Update copyright headers
- `npm run release` - Prepare a release

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

The project uses Node.js 20.18.0 (specified in `.nvmrc`).

### TypeScript

- Production config: `tsconfig.json` (excludes test files)
- Test config: `tsconfig.test.json` (includes test files and mocks)

### Linting

ESLint is configured with:

- TypeScript rules
- Jest plugin for test files
- Prettier integration
- Import resolution

### Formatting

Prettier is configured with:

- 2-space indentation
- Single quotes
- Semicolons
- 80 character line width

### Build

Rollup is configured to:

- Bundle TypeScript to ES modules
- Minify with Terser
- Resolve Node.js modules
- Handle CommonJS dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `npm run all` to ensure everything passes
6. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the
[LICENSE](LICENSE) file for details.
