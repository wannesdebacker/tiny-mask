/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/index.ts', '**/types.ts', '**/stories/**', '**/*.test.ts'],
      thresholds: {
        lines: 69,
        branches: 69,
        functions: 69,
        statements: 69,
      },
    },
  },
});
