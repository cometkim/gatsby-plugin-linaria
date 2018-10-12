# Linaria plugin for Gatsby

🚧 Linaria is currently in alpha and has two important issues ([222][] and [249][]) that need to be resolved in order for this integration to work smoothly. I'm really excited about this library too, but I suggest not jumping on this ship just yet. 🚧

[222]: https://github.com/callstack/linaria/issues/222
[249]: https://github.com/callstack/linaria/issues/249

---

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

By default this plugin enables `displayName` in development mode.

Happy styling! :art:

[Linaria]: https://github.com/callstack/linaria
[Babel preset]: https://github.com/callstack/linaria/blob/master/docs/BABEL_PRESET.md
