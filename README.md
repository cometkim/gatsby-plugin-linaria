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

## Critical CSS Extraction

GatsbyJS & Linaria extract your stylesheet and inject into the `<head>` by default. So, you don't need to worry about the SSR & FOUC.

However, the extracted stylesheet would be huge for large site, because it includes css used by whole pages/components

This plugin provide an option `extractCritical` that use `linaria/server` API behind the scene

```js
{
  resolve: 'gatsby-plugin-linaria',
  options: {
    extractCritical: true, // false by default.
  },
}
```

When you opt-in this feature, only **Critical CSS** is injected into the `<head>`.

And loading full CSS will be deferred for later paint or navigations.

See [this](https://github.com/cometkim/gatsby-plugin-linaria/issues/94#issuecomment-654760281) for more detailed explanation.

## LICENSE

MIT

----

Happy styling! :art:
