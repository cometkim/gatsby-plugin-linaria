module.exports = {
  plugins: [
    '@cometjs',
  ],
  extends: [
    'plugin:@cometjs/auto',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
