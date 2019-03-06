# Linaria plugin for Gatsby

This plugin modifies Gatsby's webpack configuration to support [Linaria][].

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

Finally, make sure to add `.linaria-cache` to your `.gitignore` file.

That's it! gatsby-plugin-linaria configures Linaria's webpack plugin to use [babel-preset-gatsby][], which contains Gatsby's Babel configuration.

Happy styling! :art:

[Linaria]: https://github.com/callstack/linaria
[babel-preset-gatsby]: https://github.com/gatsbyjs/gatsby/tree/master/packages/babel-preset-gatsby
