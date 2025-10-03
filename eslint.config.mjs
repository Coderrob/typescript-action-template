// Modern ESLint Flat Configuration
// See: https://eslint.org/docs/latest/use/configure/configuration-files

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // Global ignores
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/lib/**',
      '**/build/**',
      '*.config.{js,mjs,cjs}',
      'badges/**',
      'script/**'
    ]
  },

  // Base configuration for all files
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': ['error', { semi: true }]
    }
  },

  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.test.json'],
        tsconfigRootDir: __dirname
      },
      globals: {
        ...globals.node,
        NodeJS: 'readonly',
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: _import,
      sonarjs
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.test.json'
        }
      }
    },
    rules: {
      // Base ESLint recommended
      ...js.configs.recommended.rules,

      // Complexity rules (fail build on high complexity)
      complexity: ['error', { max: 10 }],

      // SonarJS rules for static analysis (selective adoption)
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/pseudo-random': 'warn',
      'sonarjs/publicly-writable-directories': 'warn',

      // TypeScript ESLint rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',

      // Import sorting and organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
        }
      ],

      // Custom overrides
      camelcase: 'off',
      'no-console': 'off',
      'no-shadow': 'off',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always']
    }
  },

  // Test files and mock files configuration
  {
    files: [
      '**/__tests__/**/*.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/__mocks__/**/*.{ts,tsx}'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        NodeJS: 'readonly',
        jest: 'readonly'
      }
    },
    plugins: {
      jest
    },
    rules: {
      // Jest recommended rules
      ...jest.configs.recommended.rules,
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/prefer-to-have-length': 'warn',

      // Relax some rules for test files
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/require-await': 'off',
      'sonarjs/publicly-writable-directories': 'off'
    }
  }
];
