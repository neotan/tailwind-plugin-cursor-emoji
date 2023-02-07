const createCursorEmoji = require('./createCursorEmoji')
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')

module.exports = function ({ matchUtilities, theme }) {
  const fontSizes = theme('fontSize')
  const colors = flattenColorPalette(theme('colors'))
  matchUtilities({ 'cursor-emoji': createCursorEmoji({ fontSizes, colors }), })
}