import type * as Webpack from 'webpack';
import type { GatsbyNode } from 'gatsby';

import { TS_RULE_TEST } from './utils';

type Falsy = false | null | undefined | 0 | '';
type Conditional<T> = T | Falsy;
function isTruthy<T>(condition: Conditional<T>): condition is Exclude<T, Falsy> {
  return Boolean(condition);
}

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig, replaceWebpackConfig },
  getConfig,
  rules,
  stage,
}) => {
  const config = getConfig() as Webpack.Configuration;
  const isDevelop = stage.startsWith('develop');
  const usingTS = config.module?.rules?.some(rule => (
    typeof rule === 'object' &&
    rule.test instanceof RegExp &&
    rule.test.source === TS_RULE_TEST
  ));
  const linariaLoader: Webpack.RuleSetUseItem = {
    loader: 'linaria/loader',
    options: {
      sourceMap: isDevelop,
      displayName: isDevelop,
      babelOptions: {
        presets: [
          'babel-preset-gatsby',
          usingTS && '@babel/preset-typescript',
        ].filter(isTruthy),
      },
    },
  };
  const jsRule: Webpack.RuleSetRule = {
    ...rules.js() as Webpack.RuleSetRule,
    use: [linariaLoader],
  };
  const tsRule: Conditional<Webpack.RuleSetRule> = usingTS && {
    test: new RegExp(TS_RULE_TEST),
    use: [linariaLoader],
  };
  setWebpackConfig({
    module: {
      rules: [jsRule, tsRule].filter(isTruthy),
    },
  });

  // Linaria evaluator cannot handle esmodule syntax
  // @See https://github.com/cometkim/gatsby-plugin-linaria/issues/19
  const newConfig = getConfig() as Webpack.Configuration;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete newConfig.resolve?.alias?.['@reach/router'];
  replaceWebpackConfig(newConfig);

  if (config.optimization) {
    // Split chunk for linaria stylesheets
    const newConfig = getConfig() as Webpack.Configuration;

    const { cacheGroups = {} } = newConfig.optimization?.splitChunks || {};
    if (typeof cacheGroups.styles !== 'object') {
      return;
    }
    if (cacheGroups.styles instanceof RegExp) {
      return;
    }

    const styleGroupPriority = cacheGroups.styles.priority || 65536;
    cacheGroups.linaria = {
      name: 'linaria',
      test: /\.linaria\.css$/,
      chunks: 'all',
      enforce: true,
      // Set priority grater than default group
      priority: styleGroupPriority + 1,
    };

    replaceWebpackConfig(newConfig);
  }
};
