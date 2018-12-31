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

  const linariaConfig = {
    loader: 'linaria/loader',
    options: {
      sourceMap: stage.includes('develop'),
    },
  }

  const sourceRules = config.module.rules.filter(({ test }) => {
    if (!test) return false
    return [rules.js().test.source, '\\.tsx?$'].includes(test.source)
  })

  sourceRules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.push(linariaConfig)
    } else if (rule.use) {
      rule.use = [rule.use, linariaConfig]
    }
  })

  replaceWebpackConfig(config)
}
