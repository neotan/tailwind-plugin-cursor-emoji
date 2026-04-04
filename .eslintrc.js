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
