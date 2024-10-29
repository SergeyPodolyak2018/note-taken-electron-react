import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTest.ts',
      root: 'test/',
      alias: {
        '@/': new URL('./src/', import.meta.url).pathname,
      },
      coverage: {
        enabled: true,
        provider: 'v8',
        include: ['./src/**'],
        reporter: ['text', 'json', 'html'],
      },
    },
  })
);
