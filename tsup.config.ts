import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  external: ['tailwindcss'],
})
