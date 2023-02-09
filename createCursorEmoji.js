const svgToDataURL = require('svg-to-dataurl')
const toPX = require('to-px')

const MAX_CURSOR_SIZE = 128
const PADDING = 5
const RECOMMENDED_CURSOR_SIZE = 32
const RECOMMENDED_ARROW_COLOR = '#000000'
const SCALE_HEIGHT = 1.2
const SCALE_WIDTH = 0.8

module.exports = function createCursorEmoji({ fontSizes = {}, colors = {} }) {

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

      console.dir({ height, width, fontSize })

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

