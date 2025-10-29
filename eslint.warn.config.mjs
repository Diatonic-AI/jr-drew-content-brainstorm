import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';

const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.local/**',
  '**/.obsidian/**',
  '**/.pip_packages/**',
  '**/.venv/**',
  '**/.backup/**',
  '**/*.min.js',
  'apps/web-next/.next/**',
  'apps/web-next/out/**',
  'site/**',
  'logs/**',
  'infra/firebase/functions/lib/**',
  '.turbo',
  'reports/**'
];

const warnRules = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-no-useless-fragment': 'warn',
  'import/no-default-export': 'off',
  'import/order': [
    'warn',
    {
      groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }
  ],
  'import/newline-after-import': ['warn', { count: 1 }],
  'unicorn/prefer-node-protocol': 'warn',
  'unicorn/filename-case': [
    'warn',
    {
      cases: { camelCase: true, pascalCase: true, kebabCase: true }
    }
  ],
  'sonarjs/no-duplicate-string': 'warn',
  'sonarjs/no-identical-functions': 'warn',
  'security/detect-non-literal-fs-filename': 'warn',
  'security/detect-possible-timing-attacks': 'warn',
  'security/detect-eval-with-expression': 'warn',
  'tailwindcss/classnames-order': 'warn',
  'tailwindcss/no-custom-classname': 'off'
};

const strictOverrides = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
  'react-hooks/exhaustive-deps': 'error',
  'react/jsx-no-useless-fragment': 'error',
  'import/no-default-export': 'error',
  'import/order': [
    'error',
    {
      groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }
  ],
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/filename-case': [
    'error',
    {
      cases: { camelCase: true, pascalCase: true, kebabCase: true }
    }
  ],
  'sonarjs/no-duplicate-string': 'error',
  'sonarjs/no-identical-functions': 'error',
  'security/detect-non-literal-fs-filename': 'error',
  'security/detect-possible-timing-attacks': 'error',
  'security/detect-eval-with-expression': 'error'
};

export const createConfig = (strict = false) => {
  const rules = JSON.parse(JSON.stringify(warnRules));
  if (strict) {
    for (const [key, value] of Object.entries(strictOverrides)) {
      rules[key] = value;
    }
  }

  return [
    { ignores },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended'],
    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: { jsx: true }
        },
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2021
        }
      },
      plugins: {
        '@typescript-eslint': tsPlugin,
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
        import: importPlugin,
        unicorn: unicornPlugin,
        'jsx-a11y': jsxA11yPlugin,
        security: securityPlugin,
        sonarjs: sonarjsPlugin,
        tailwindcss: tailwindPlugin
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'] },
          typescript: {
            alwaysTryTypes: true,
            project: [
              './tsconfig.json',
              './packages/**/tsconfig.json',
              './apps/**/tsconfig.json',
              './infra/firebase/functions/tsconfig.json'
            ]
          }
        }
      },
      rules
    },
    {
      files: ['**/*.cjs', '**/*.cts', '**/*.mjs', '**/*.mts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'script'
        },
        globals: {
          ...globals.node
        }
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off'
      }
    }
  ];
};

export default createConfig(false);
