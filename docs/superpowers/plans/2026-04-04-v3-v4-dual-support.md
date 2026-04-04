# Tailwind v3 + v4 Dual Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `tailwind-plugin-cursor-emoji` work with both Tailwind CSS v3 and v4, with dual CJS/ESM output and modern test tooling.

**Architecture:** Single ESM source in `src/`, built by tsup into `dist/index.cjs` + `dist/index.mjs`. Core SVG logic is unchanged. Plugin entry wraps with `tailwindcss/plugin`. Vitest replaces Jest with matrix testing against both TW versions.

**Tech Stack:** tsup (build), Vitest (test), ESM source, Tailwind CSS v3 + v4

---

### Task 1: Scaffold build tooling (tsup + package.json)

**Files:**
- Create: `tsup.config.ts`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `.npmignore`

- [ ] **Step 1: Update package.json**

Replace the full contents of `package.json` with:

```json
{
  "name": "tailwind-plugin-cursor-emoji",
  "version": "1.0.0",
  "description": "Tailwind plugin for using emoji as cursor",
  "author": "Neo TAN",
  "repository": "https://github.com/neotan/tailwind-plugin-cursor-emoji",
  "homepage": "https://github.com/neotan/tailwind-plugin-cursor-emoji",
  "license": "MIT",
  "private": false,
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "vitest",
    "test": "vitest run",
    "lint": "eslint src/ tests/ --fix"
  },
  "peerDependencies": {
    "tailwindcss": ">=3.0.0"
  },
  "dependencies": {
    "svg-to-dataurl": "^1.0.0",
    "to-px": "^1.1.0"
  },
  "devDependencies": {
    "eslint": "^8.33.0",
    "tailwindcss": "^3.4.0",
    "tsup": "^8.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create tsup.config.ts**

Create `tsup.config.ts`:

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  external: ['tailwindcss'],
})
```

- [ ] **Step 3: Update .gitignore**

Replace contents of `.gitignore` with:

```
dist/
node_modules/
coverage/
.vscode/
```

- [ ] **Step 4: Update .npmignore**

Replace contents of `.npmignore` with:

```
/images
/src
/tests
/docs
/coverage
/.github
/.vscode
/.eslintrc.js
tsup.config.ts
vitest.config.ts
```

- [ ] **Step 5: Commit**

```bash
git add package.json tsup.config.ts .gitignore .npmignore
git commit -m "chore: add tsup build config and update package.json for dual CJS/ESM"
```

---

### Task 2: Migrate source to ESM in src/

**Files:**
- Create: `src/createCursorEmoji.js`
- Create: `src/index.js`

- [ ] **Step 1: Create src/createCursorEmoji.js**

This is the core logic, converted from CJS to ESM. The `console.dir` debug line is removed.

```js
import svgToDataURL from 'svg-to-dataurl'
import toPX from 'to-px'

const MAX_CURSOR_SIZE = 128
const PADDING = 5
const RECOMMENDED_CURSOR_SIZE = 32
const RECOMMENDED_ARROW_COLOR = '#000000'
const SCALE_HEIGHT = 1.2
const SCALE_WIDTH = 0.8

export default function createCursorEmoji({ fontSizes = {}, colors = {} }) {

  return (value) => {
    const [
      emoji = '',
      sizeVariant = RECOMMENDED_CURSOR_SIZE,
      colorVariant = RECOMMENDED_ARROW_COLOR,
      opacityStr = '100'
    ] = value.split('/')

    try {
      const length = Array.from(new Intl.Segmenter().segment(emoji)).length || 1
      const fontSize = fontSizes[sizeVariant]
        ? toPX(fontSizes[sizeVariant][0])
        : Number(sizeVariant)

      const arrowColor = colors[colorVariant]
        ? colors[colorVariant]
        : colorVariant

      const height = fontSize * SCALE_HEIGHT + PADDING
      const width = Number(height) * SCALE_WIDTH * length + PADDING
      const opacity = Number(opacityStr) / 100

      if (fontSize > MAX_CURSOR_SIZE || height > MAX_CURSOR_SIZE || width > MAX_CURSOR_SIZE) {
        console.error(`fontSize:${fontSize} / height:${height} / width:${width} might exceed the browser limit ${MAX_CURSOR_SIZE}!`)
      }

      return {
        cursor: 'url(\''
          + svgToDataURL(`<svg xmlns="http://www.w3.org/2000/svg" width="${(width).toFixed(0)}" height="${(height).toFixed(0)}" viewport="0 0 100 100" fill="${arrowColor}" fill-opacity="${(opacity).toFixed(2)}" style="font-size:${(fontSize).toFixed(0)}px;"><text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle">${emoji}</text><path d="M 1.842476487159729 8.157524108886719 A 1.0792976844564792 1.0792976844564792 0 0 1 9.653412291754648e-8 7.394345760345459 L 9.653412291754648e-8 1.0792977809906006 A 1.0792976844564792 1.0792976844564792 0 0 1 1.0792977809906006 9.653412291754648e-8 L 7.394345283508301 9.653412291754648e-8 A 1.0792976844564792 1.0792976844564792 0 0 1 8.157524108886719 1.842476487159729 L 1.842476487159729 8.157524108886719 Z " transform="matrix(1 0 0 1 -3.92828e-7 -0.00000107009)"></path></svg>`)
          + '\') 0 0, auto;'
      }
    } catch (error) {
      console.error(error)
      throw new Error('[tailwind-plugin-cursor-emoji]: Generating Tailwind classes failed!', { cause: error })
    }
  }
}
```

- [ ] **Step 2: Create src/index.js**

```js
import plugin from 'tailwindcss/plugin'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import createCursorEmoji from './createCursorEmoji.js'

export default plugin(function ({ matchUtilities, theme }) {
  const fontSizes = theme('fontSize')
  const colors = flattenColorPalette(theme('colors'))
  matchUtilities({
    'cursor-emoji': createCursorEmoji({ fontSizes, colors }),
  })
})
```

- [ ] **Step 3: Commit**

```bash
git add src/
git commit -m "feat: migrate source to ESM in src/ with plugin() wrapper"
```

---

### Task 3: Set up Vitest and migrate tests

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/index.test.js`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

- [ ] **Step 2: Create tests/index.test.js**

Adapted from the existing Jest tests. Uses Vitest's `expect`/`test`/`describe`/`vi` (API-compatible with Jest). Imports from `src/` directly for unit testing.

```js
import { describe, test, expect, vi, afterEach, afterAll } from 'vitest'
import createCursorEmoji from '../src/createCursorEmoji.js'

const fontSizes = {
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '9xl': ['8rem', { lineHeight: '2.5rem' }],
}
const colors = {
  'green-500': '#22c55e',
  'blue-500': '#3b82f6',
  'red-500': '#ef4444',
}

const cases = [
  {
    input: '😜/lg',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2226%22%20height%3D%2227%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%23000000%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A18px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2243%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%23000000%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A32px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/40',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2247%22%20height%3D%2253%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%23000000%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A40px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/red',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22red%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/green-500',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%2322c55e%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/#e76215',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%23e76215%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/rgb(231,98,21)',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22rgb(231%2C98%2C21)%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/hsl(22deg,84%,49%)',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22hsl(22deg%2C84%25%2C49%25)%22%20fill-opacity%3D%221.00%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  },
  {
    input: '😜/4xl/blue-500/70',
    expected: 'url(\'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2244%22%20height%3D%2248%22%20viewport%3D%220%200%20100%20100%22%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.70%22%20style%3D%22font-size%3A36px%3B%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2260%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%F0%9F%98%9C%3C%2Ftext%3E%3Cpath%20d%3D%22M%201.842476487159729%208.157524108886719%20A%201.0792976844564792%201.0792976844564792%200%200%201%209.653412291754648e-8%207.394345760345459%20L%209.653412291754648e-8%201.0792977809906006%20A%201.0792976844564792%201.0792976844564792%200%200%201%201.0792977809906006%209.653412291754648e-8%20L%207.394345283508301%209.653412291754648e-8%20A%201.0792976844564792%201.0792976844564792%200%200%201%208.157524108886719%201.842476487159729%20L%201.842476487159729%208.157524108886719%20Z%20%22%20transform%3D%22matrix(1%200%200%201%20-3.92828e-7%20-0.00000107009)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E\') 0 0, auto;'
  }
]

test.each(cases)('Create cursor for class: $input', ({ input, expected }) => {
  expect(createCursorEmoji({ fontSizes, colors })(input).cursor).toEqual(expected)
})

describe('Log error message when the size of cursor exceeded browser limit.', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { return })

  afterEach(() => {
    consoleError.mockClear()
  })

  afterAll(() => {
    consoleError.mockRestore()
  })

  test('Log error message when Computed fontSize or height or width > MAX_CURSOR_SIZE', () => {
    createCursorEmoji({ fontSizes, colors })('😜/9xl')
    expect(consoleError).toBeCalled()
  })
})
```

- [ ] **Step 3: Install dependencies and run tests**

```bash
rm -rf node_modules package-lock.json
npm install
npx vitest run
```

Expected: All 10 tests pass (9 cursor cases + 1 error case).

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: `dist/index.cjs` and `dist/index.mjs` are created without errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/
git commit -m "test: migrate from Jest to Vitest with ESM support"
```

---

### Task 4: Remove old files and clean up

**Files:**
- Delete: `index.js` (root)
- Delete: `createCursorEmoji.js` (root)
- Delete: `index.test.js` (root)
- Delete: `coverage/` (root)
- Delete: `.eslintrc.js` (root, update for ESM)
- Modify: `.eslintrc.js` → replace with flat config or remove `jest: true`

- [ ] **Step 1: Delete old source, test, and coverage files**

```bash
rm index.js createCursorEmoji.js index.test.js
rm -rf coverage/
```

- [ ] **Step 2: Update .eslintrc.js**

Replace `.eslintrc.js` to remove `jest: true` (no longer needed):

```js
module.exports = {
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  env: {
    node: true
  },
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    indent: ['warn', 2]
  },
}
```

- [ ] **Step 3: Run tests and build again to verify nothing broke**

```bash
npm run test
npm run build
```

Expected: All tests pass, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old CJS source files and Jest artifacts"
```

---

### Task 5: Update CI workflows

**Files:**
- Modify: `.github/workflows/run-tests.yml`
- Modify: `.github/workflows/npm-publish.yml`

- [ ] **Step 1: Update run-tests.yml with TW v3/v4 matrix**

Replace `.github/workflows/run-tests.yml` with:

```yaml
name: Tests

on:
  push:
    branches: [develop, master]
  pull_request:
    branches: [master]

jobs:
  run-tests:
    runs-on: ubuntu-latest
    name: Test (Node ${{ matrix.node }}, TW ${{ matrix.tailwind }})
    strategy:
      matrix:
        node: [18.x, 20.x]
        tailwind: [3, 4]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Install npm dependencies
        run: npm ci

      - name: Install Tailwind CSS version
        run: npm install --no-save tailwindcss@${{ matrix.tailwind }}

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm run test
```

- [ ] **Step 2: Update npm-publish.yml**

Replace `.github/workflows/npm-publish.yml` with:

```yaml
name: Publish to NPM
on:
  release:
    types: [created]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - name: Install dependencies and build
        run: npm ci && npm run build
      - name: Publish package on NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "ci: update workflows for Node 18/20 and TW v3/v4 matrix"
```

---

### Task 6: Update README for v4 usage

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README.md**

Add v4 usage instructions after the existing v3 installation section. Replace the "Add it to the plugins array" section with both v3 and v4 examples:

Find the section that starts with `Add it to the plugins array` and replace it through the closing ` ``` ` with:

```markdown
### Tailwind CSS v3

Add it to the plugins array of `tailwind.config.js`.

```js
// tailwind.config.js

plugins: [
    // ...
    require('tailwind-plugin-cursor-emoji'),
],
```

### Tailwind CSS v4

Add it with the `@plugin` directive in your CSS file.

```css
/* app.css */
@import "tailwindcss";
@plugin "tailwind-plugin-cursor-emoji";
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add Tailwind v4 usage instructions to README"
```
