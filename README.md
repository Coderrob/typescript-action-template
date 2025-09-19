# TypeScript Action Template

A comprehensive GitHub Action template repository for building robust
TypeScript-based GitHub Actions.

## Features

- **TypeScript Support**: Full TypeScript configuration with strict type
  checking
- **ESLint & Prettier**: Code linting and formatting with Prettier integration
- **Jest Testing**: Unit testing framework with coverage reporting
- **Rollup Build**: Optimized bundling with minification using Terser
- **Dependency Injection**: ILogger abstraction for better testability
- **EditorConfig**: Consistent coding styles across editors
- **CI/CD Ready**: Pre-configured scripts for building, testing, and releasing

## Project Structure

```
├── src/
│   ├── index.ts          # Main entry point
│   ├── action.ts         # Core action logic
│   ├── action.test.ts    # Unit tests
│   └── logger.ts         # Logging abstraction
├── __mocks__/            # Test mocks
├── script/               # Utility scripts
├── badges/               # Coverage badges
├── dist/                 # Build output (generated)
├── tsconfig.json         # Production TypeScript config
├── tsconfig.test.json    # Test TypeScript config
├── rollup.config.ts      # Build configuration
├── jest.config.mjs       # Test configuration
├── eslint.config.mjs     # Linting configuration
└── .editorconfig         # Editor style configuration
```

## Setup

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

## Development

### Available Scripts

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run test` - Run Jest tests
- `npm run package` - Build the action
- `npm run all` - Run lint, test, and build

### Testing

Run tests with coverage:

```bash
npm test
```

### Building

Build the action for distribution:

```bash
npm run package
```

## Usage in Workflows

```yaml
- name: Run TypeScript Action
  uses: your-org/your-action@v1
  with:
    # Add your inputs here
```

## Configuration

### TypeScript

- Production config: `tsconfig.json` (excludes test files)
- Test config: `tsconfig.test.json` (includes test files and mocks)

### Linting

ESLint is configured with:

- TypeScript rules
- Jest plugin for test files
- Prettier integration

### Formatting

Prettier is configured with:

- 2-space indentation
- Single quotes
- Semicolons
- 80 character line width

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
