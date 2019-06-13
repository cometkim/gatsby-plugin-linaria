const TS_RULE_TEST = '\\.tsx?$'

exports.onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
  const { replaceWebpackConfig } = actions
  const config = getConfig()

  const JS_RULE_TEST = rules.js().test.source

  const sourceRules = config.module.rules.filter(({ test, exclude }) => {
    if (!test) return false
    return (
      (test.source === JS_RULE_TEST &&
        exclude != null &&
        exclude.source.includes('node_modules')) ||
      // TypeScript rule has no `exclude` or `include`
      test.source === TS_RULE_TEST
    )
  })

  sourceRules.forEach(rule => {
    // gatsby-plugin-typescript doesn't put it in an array
    if (!Array.isArray(rule.use)) {
      rule.use = [rule.use]
    }

    rule.use.push({
      loader: 'linaria/loader',
      options: {
        sourceMap: stage.includes('develop'),
        displayName: stage.includes('develop'),
        babelOptions: {
          presets:
            rule.test.source === TS_RULE_TEST
              ? ['babel-preset-gatsby', '@babel/preset-typescript']
              : ['babel-preset-gatsby'],
        },
      },
    })
  })

  replaceWebpackConfig(config)
}
