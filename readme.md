# Linaria plugin for Gatsby

This plugin modifies Gatsby's Babel and webpack configuration to support [Linaria][].

Install the plugin and Linaria:

```sh
yarn add gatsby-plugin-linaria linaria
```

Add it to your plugins in `gatsby-config.js`:

```js
plugins: [
  'gatsby-plugin-linaria',
]
```

You can pass options to Linaria's [Babel preset]:

```js
plugins: [
  {
    resolve: 'gatsby-plugin-linaria',
    options: {
      evaluate: true,
      displayName: process.env.NODE_ENV !== 'production',
    },
  },
]
```

These are the defaults, so unless you need a different behavior you don't need to pass any options.

## Babel configuration file

gatsby-plugin-linaria also requires adding a [custom Babel configuration file][custom-babel-config] to your Gatsby project. That way Linaria can pick it up and use it for its evaluate feature.

While gatsby-plugin-linaria already adds Linaria's babel preset, tools like ESLint and Jest might also use this Babel configuration file and they won't know about gatsby-plugin-linaria, so it's best to add it again:

```js
// babel.config.js
module.exports = {
  presets: [
    // add this preset to the bottom
    ['linaria/babel', {
      evaluate: true,
      displayName: true,
    }],
  ],
}
```

These options are only for tools like ESLint and Jest, Gatsby will use the ones you set through gatsby-plugin-linaria.

This is pretty icky, I know, but hopefully we will be able to avoid this in the future.

Happy styling! :art:

[Linaria]: https://github.com/callstack/linaria
[custom-babel-config]: https://www.gatsbyjs.org/docs/babel/#how-to-use-a-custom-babelrc-file
[Babel preset]: https://github.com/callstack/linaria/blob/master/docs/BABEL_PRESET.md
