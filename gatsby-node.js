exports.onCreateBabelConfig = ({ actions, stage }, pluginOptions) => {
  const { setBabelPreset } = actions
  setBabelPreset({
    name: 'linaria/babel',
    options: Object.assign(
      {},
      {
        displayName: stage.includes('develop'),
      },
      pluginOptions
    ),
  })
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const { setWebpackConfig } = actions
  setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'linaria/loader',
              options: {
                sourceMap: stage.includes('develop'),
              },
            },
          ],
        },
      ],
    },
  })
}
