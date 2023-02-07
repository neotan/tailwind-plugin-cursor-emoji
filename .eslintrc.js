module.exports = {
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    node: true,
    jest: true
  },
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    indent: ['warn', 2]
  },
}
