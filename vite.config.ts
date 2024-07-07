import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { glob } from 'glob';
import { extname, relative } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import sassDts from 'vite-plugin-sass-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss(), dts({ include: ['lib'] }), sassDts()],
  build: {
    lib: {
      entry: 'lib/components/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
      treeshake: false,
      input: Object.fromEntries(
        glob
          .sync('lib/**/*.{ts,tsx,js,jsx}', {
            ignore: ['lib/**/*.d.ts'],
          })
          .map((file) => [
            // The name of the entry point
            // lib/nested/foo.ts becomes nested/foo
            relative('lib', file.slice(0, file.length - extname(file).length)),
            // The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
    },
  },
  optimizeDeps: {
    include: [
      'core-js/es',
      'core-js/web/immediate',
      'core-js/web/queue-microtask',
      'core-js/web/timers',
    ],
  },
});