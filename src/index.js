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
