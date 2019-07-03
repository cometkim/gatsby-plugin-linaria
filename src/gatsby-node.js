const TS_RULE_TEST = '\\.tsx?$'

export const onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
  const config = getConfig()
  const isDevelop = stage.startsWith('develop')
  const isBuild = stage.startsWith('build')
  const usingTS = config.module.rules.some(
    ({ test }) => test && test.source === TS_RULE_TEST
  )
  const linariaLoader = {
    loader: 'linaria/loader',
    options: {
      sourceMap: isDevelop,
      displayName: isDevelop,
      babelOptions: {
        presets: usingTS
          ? ['babel-preset-gatsby', '@babel/preset-typescript']
          : ['babel-preset-gatsby'],
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

  actions.setWebpackConfig({
    module: {
      rules: [jsRule, tsRule].filter(Boolean),
    },
    // Split chunk for linaria stylesheets
    ...(isBuild && {
      optimization: {
        splitChunks: {
          cacheGroups: {
            linaria: {
              name: 'linaria',
              test: /\.linaria\.css$/,
              chunks: 'all',
              enforce: true,
              // Set priority grater than default group
              priority: 1,
            },
          },
        },
      },
    }),
  })
}
