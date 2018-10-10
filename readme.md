# Linaria plugin for Gatsby

This plugin modifies Gatsby's Babel and webpack configuration to support [Linaria][].

Install the plugin and Linaria:

```sh
yarn add gatsby-plugin-linaria linaria
```

Add it to your plugins:

```js
// gatsby-config.js
module.exports = {
  plugins: [
    'gatsby-plugin-linaria',
  ],
}
```

You can pass options to Linaria's [Babel preset]:

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-linaria',
      options: {
        evaluate: true,
        displayName: process.env.NODE_ENV !== 'production',
      },
    },
  ],
}
```

By default this plugin enables `displayName` in development mode.

Have fun styling! :art:

[Linaria]: https://github.com/callstack/linaria
[Babel preset]: https://github.com/callstack/linaria/blob/master/docs/BABEL_PRESET.md
