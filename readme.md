# Linaria plugin for Gatsby

This plugin modifies Gatsby's webpack configuration to support [Linaria][].

---

**Note**: You still need to set up Babel configuration manually. More information at the bottom.

---

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

## Babel configuration file

Currently, gatsby-plugin-linaria also requires setting up a [custom Babel configuration file][custom-babel-config] to your Gatsby project in order for Linaria to be able to pick it up. I hope to eliminate this requirement in the future.

```
yarn add babel-preset-gatsby
```

```js
// babel.config.js
module.exports = {
  presets: [
    'babel-preset-gatsby',
    ['linaria/babel', {
      evaluate: true,
      displayName: process.env.NODE_ENV !== 'production',
    }],
  ],
}
```

Also, make sure to add `.linaria-cache` to your `.gitignore` file.

Happy styling! :art:

[Linaria]: https://github.com/callstack/linaria
[custom-babel-config]: https://www.gatsbyjs.org/docs/babel/#how-to-use-a-custom-babelrc-file
[Babel preset]: https://github.com/callstack/linaria/blob/master/docs/BABEL_PRESET.md
