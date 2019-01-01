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

  const tests = [rules.js().test.source, '\\.tsx?$']

  const sourceRules = config.module.rules.filter(({ test }) => {
    if (!test) return false
    return tests.includes(test.source)
  })

  sourceRules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.push(linariaConfig)
    } else if (rule.use) {
      // gatsby-plugin-typescript doesn't put it in an array
      rule.use = [rule.use, linariaConfig]
    }
  })

  replaceWebpackConfig(config)
}
