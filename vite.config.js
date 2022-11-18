import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'bin',
    commonjsOptions: {
      strictRequires: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src", 'main.ts'),
      },
      output: {
        entryFileNames: 'boolean.js',
        format: 'esm',
        strict: true,
      },
    }
  }
})
