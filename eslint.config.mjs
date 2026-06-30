import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  playwright.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Включаем строгие запреты для Playwright (ошибки, которые не дадут сделать коммит)
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/expect-expect': 'error',
      'playwright/no-skipped-test': 'warn',

      // Отключаем некоторые базовые правила TS, которые мешают в тестах
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  prettierConfig,
];
