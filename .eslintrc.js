module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
  },
  plugins: [
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  settings: {
    react: {
      version: '16.4.2',
    },
  },
  rules: {
    'prettier/prettier': 'error',
  },
}
