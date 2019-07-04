const TS_RULE_TEST = '\\.tsx?$'

export const onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
  const { setWebpackConfig, replaceWebpackConfig } = actions
  const config = getConfig()
  const isDevelop = stage.startsWith('develop')
  const usingTS = config.module.rules.some(
    ({ test }) => test && test.source === TS_RULE_TEST
  )
  const linariaLoader = {
    loader: 'linaria/loader',
    options: {
      sourceMap: isDevelop,
      displayName: isDevelop,
      babelOptions: {
        presets: [
          'babel-preset-gatsby',
          usingTS && '@babel/preset-typescript',
        ].filter(Boolean),
      },
    },
  }
  const jsRule = {
    ...rules.js(),
    use: [linariaLoader],
  }
  const tsRule = usingTS && {
    test: new RegExp(TS_RULE_TEST),
    use: [linariaLoader],
  }
  setWebpackConfig({
    module: {
      rules: [jsRule, tsRule].filter(Boolean),
    },
  })

  if (config.optimization) {
    // Split chunk for linaria stylesheets
    const newConfig = getConfig()
    newConfig.optimization.splitChunks.cacheGroups.linaria = {
      name: 'linaria',
      test: /\.linaria\.css$/,
      chunks: 'all',
      enforce: true,
      // Set priority grater than default group
      priority: 1,
    }
    replaceWebpackConfig(newConfig)
  }
}
