import type * as Webpack from 'webpack';
import type { GatsbyNode } from 'gatsby';
import type { DeepRequired } from 'utility-types';
import type { Maybe } from './utils';

import { probably, TS_RULE_TEST } from './utils';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
  getConfig,
  rules,
  stage,
}) => {
  const { setWebpackConfig, replaceWebpackConfig } = actions;
  const config = getConfig() as DeepRequired<Webpack.Configuration>;
  const isDevelop = stage.startsWith('develop');
  const usingTS = config.module.rules.some(
    ({ test }) => (test instanceof RegExp) && test.source === TS_RULE_TEST,
  );
  const linariaLoader: Webpack.NewLoader = {
    loader: 'linaria/loader',
    options: {
      sourceMap: isDevelop,
      displayName: isDevelop,
      babelOptions: {
        presets: [
          'babel-preset-gatsby',
          usingTS && '@babel/preset-typescript',
        ].filter(probably),
      },
    },
  };
  const jsRule: Webpack.RuleSetRule = {
    ...rules.js(),
    use: [linariaLoader],
  };
  const tsRule: Maybe<Webpack.RuleSetRule> = usingTS && {
    test: new RegExp(TS_RULE_TEST),
    use: [linariaLoader],
  };
  setWebpackConfig({
    module: {
      rules: [jsRule, tsRule].filter(probably),
    },
  });

  // Linaria evaluator cannot handle esmodule syntax
  // @See https://github.com/cometkim/gatsby-plugin-linaria/issues/19
  const newConfig = getConfig() as DeepRequired<Webpack.Configuration>;
  delete newConfig.resolve.alias['@reach/router'];
  replaceWebpackConfig(newConfig);

  if (config.optimization) {
    // Split chunk for linaria stylesheets
    const newConfig = getConfig() as DeepRequired<Webpack.Configuration>;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore Don't try to assert this or you would do blame TypeScript
    newConfig.optimization.splitChunks.cacheGroups.linaria = {
      name: 'linaria',
      test: /\.linaria\.css$/,
      chunks: 'all',
      enforce: true,
      // Set priority grater than default group
      priority: 1,
    };
    replaceWebpackConfig(newConfig);
  }
};
