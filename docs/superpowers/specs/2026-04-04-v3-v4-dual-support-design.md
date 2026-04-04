# Tailwind CSS v3 + v4 Dual Support

## Goal

Enhance `tailwind-plugin-cursor-emoji` to support both Tailwind CSS v3 (latest) and v4 (latest) while modernizing the build and test tooling.

## Current State

- CJS-only (`require`/`module.exports`)
- Bare function export (no `plugin()` wrapper)
- Imports `flattenColorPalette` from `tailwindcss/lib/util/flattenColorPalette`
- Jest for testing, v3 only
- peerDependency: `tailwindcss ^3.0`

## Approach: Single source, version-agnostic

The core plugin APIs (`matchUtilities`, `theme()`) and `flattenColorPalette` work identically in v3 and v4. No version branching needed — one codebase, one export.

## Project Structure

```
src/
  index.js              — plugin entry (ESM, wraps with plugin())
  createCursorEmoji.js  — core SVG generation logic (ESM)
tests/
  index.test.js         — Vitest tests (adapted from current Jest tests)
tsup.config.ts          — dual CJS/ESM build config
vitest.config.ts        — test config
package.json            — updated exports, scripts, deps
```

Old root-level `index.js`, `createCursorEmoji.js`, `index.test.js` are removed after migration.

## Key Changes

### 1. ESM Source in `src/`

Convert both files to ESM (`import`/`export`). Import `flattenColorPalette` without `.js` extension (required for v4 compatibility).

### 2. Wrap with `plugin()`

```js
import plugin from 'tailwindcss/plugin'
import createCursorEmoji from './createCursorEmoji.js'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'

export default plugin(function ({ matchUtilities, theme }) {
  const fontSizes = theme('fontSize')
  const colors = flattenColorPalette(theme('colors'))
  matchUtilities({
    'cursor-emoji': createCursorEmoji({ fontSizes, colors }),
  })
})
```

This works for:
- v3: `plugins: [require('tailwind-plugin-cursor-emoji')]` in `tailwind.config.js`
- v4: `@plugin "tailwind-plugin-cursor-emoji"` in CSS

### 3. tsup Build

Outputs `dist/index.cjs` and `dist/index.mjs` from ESM source.

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  external: ['tailwindcss'],
})
```

### 4. Package.json Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "files": ["dist"],
  "peerDependencies": {
    "tailwindcss": ">=3.0.0"
  }
}
```

### 5. Vitest

Replace Jest with Vitest. Same test cases, native ESM support. Tests import `createCursorEmoji` directly (unit tests on pure logic).

### 6. CI Matrix

GitHub Actions workflow tests against both `tailwindcss@3` and `tailwindcss@4` in a matrix.

### 7. Cleanup

- Remove `console.dir` debug statement from `createCursorEmoji.js` (line 39)
- Remove old root-level source files after migration
- Update `.gitignore` to include `dist/`
- Remove `coverage/` directory (Vitest uses different output)

## What Stays the Same

- Core SVG generation logic in `createCursorEmoji`
- Utility class syntax: `cursor-emoji-[emoji/size/color/opacity]`
- Runtime dependencies: `svg-to-dataurl`, `to-px`
- MIT license

## Risk

- `to-px` is a CJS-only package — tsup handles this via bundling or external config. If issues arise, inline the trivial conversion logic.
- `flattenColorPalette` default export shape may differ — the current `{ default: flattenColorPalette }` destructure in CJS maps to a default import in ESM naturally.
