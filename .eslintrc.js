module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9,
    ecmaFeatures: {
      jsx: true,
    },
  },
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
