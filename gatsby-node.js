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

exports.onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
  const { replaceWebpackConfig } = actions
  const config = getConfig()
  const jsRule = config.module.rules.find(
    ({ test }) => test.source === rules.js().test.source
  )
  jsRule.use.push({
    loader: 'linaria/loader',
    options: {
      sourceMap: stage.includes('develop'),
    },
  })
  replaceWebpackConfig(config)
}
