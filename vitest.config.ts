import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover', 'cobertura', 'json-summary'],
      all: true,
      include: ['src/**'],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 40,
        statements: 75,
      },
    },
  },
});