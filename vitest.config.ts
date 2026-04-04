import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.{js,ts}'],
  },
  resolve: {
    alias: {
      'svg-to-dataurl': path.resolve('./node_modules/svg-to-dataurl/index.js'),
    },
  },
})
