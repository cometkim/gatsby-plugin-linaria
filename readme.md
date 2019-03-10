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

## Usage with TypeScript

There are some additional steps required if you want to use
`gatsby-plugin-linaria` in conjunction with `gatsby-plugin-typescript`.

First of all, ensure that you have resolved `gatsby-plugin-linaria` before
`gatsby-plugin-typescript` in your `gatsby.config.js` file.

Secondly, you will need to override the built-in babel configuration by creating
your own `babel.config.js` in project root and giving it the following contents:

```js
module.exports = {
  presets: [
    '@babel/preset-typescript',
    'babel-preset-gatsby',
    ['linaria/babel', {
      evaluate: true,
      displayName: process.env.NODE_ENV !== 'production',
    }],
  ],
};
```

Lastly, don't forget to install `babel-preset-gatsby` and
`@babel/preset-typescript` development dependencies.

```bash
yarn add -D babel-preset-gatsby @babel/preset-typescript

#or

npm install --save-dev babel-preset-gatsby @babel/preset-typescript
```

Happy styling! :art:

[Linaria]: https://github.com/callstack/linaria
[babel-preset-gatsby]: https://github.com/gatsbyjs/gatsby/tree/master/packages/babel-preset-gatsby
