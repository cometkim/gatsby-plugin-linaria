# gatsby-plugin-linaria

[![npm](https://img.shields.io/npm/v/gatsby-plugin-linaria)](https://npm.im/gatsby-plugin-linaria)
[![npm downloads](https://img.shields.io/npm/dm/gatsby-plugin-linaria)](https://npm.im/gatsby-plugin-linaria)

Gatsby plugin for styling with [Linaria](https://linaria.dev/)

## Install

Install the plugin and Linaria:

```bash
yarn add gatsby-plugin-linaria linaria
```

Next, add the plugin to `gatsby-config.js`:

```js
plugins: [
  'gatsby-plugin-linaria',
]
```

Finally, make sure to add `.linaria-cache` to your `.gitignore` file.

## TypeScript

If you're using TypeScript, make sure to include `gatsby-plugin-typescript` **before** `gatsby-plugin-linaria` in your config:

```js
plugins: [
  'gatsby-plugin-typescript',
  'gatsby-plugin-linaria',
]
```

See [#13](https://github.com/cometkim/gatsby-plugin-linaria/issues/13#issuecomment-633154216) for more details.

Happy styling! :art:
