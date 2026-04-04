import createCursorEmoji from './createCursorEmoji.js'

function flattenColorPalette(colors) {
  const result = {}
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      result[key] = value
    } else if (typeof value === 'object' && value !== null) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        const flatKey = nestedKey === 'DEFAULT' ? key : `${key}-${nestedKey}`
        result[flatKey] = nestedValue
      }
    }
  }
  return result
}

export default function ({ matchUtilities, theme }) {
  const fontSizes = theme('fontSize') ?? {}
  const colors = flattenColorPalette(theme('colors') ?? {})
  matchUtilities({
    'cursor-emoji': createCursorEmoji({ fontSizes, colors }),
  }, {
    values: {
      wave: '👋',
      point: '👆',
      grab: '✊',
      peace: '✌️',
      thumbsup: '👍',
      fire: '🔥',
      heart: '❤️',
      star: '⭐',
      rocket: '🚀',
      eyes: '👀',
      clap: '👏',
      sparkles: '✨',
      __BARE_VALUE__: (value) => value.value,
    },
  })
}
