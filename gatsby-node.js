const TYPESCRIPT_RULE_TEST = '\\.tsx?$'

exports.onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
  const { replaceWebpackConfig } = actions
  const config = getConfig()

  const tests = [rules.js().test.source, TYPESCRIPT_RULE_TEST]

  const sourceRules = config.module.rules.filter(({ test }) => {
    if (!test) return false
    return tests.includes(test.source)
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
            rule.test.source === TYPESCRIPT_RULE_TEST
              ? ['babel-preset-gatsby', '@babel/preset-typescript']
              : ['babel-preset-gatsby'],
        },
      },
    })
  })

  replaceWebpackConfig(config)
}
