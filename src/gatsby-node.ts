import type * as Webpack from 'webpack';
import type { GatsbyNode } from 'gatsby';

import type { PluginOptions } from './utils';
import { TS_RULE_TEST } from './utils';

type Falsy = false | null | undefined | 0 | '';
type Conditional<T> = T | Falsy;
function isTruthy<T>(condition: Conditional<T>): condition is Exclude<T, Falsy> {
  return Boolean(condition);
}

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    loaderOptions: Joi.object().unknown(true).default({}),
    extractCritical: Joi.boolean().default(false),
  });
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions: { setWebpackConfig, replaceWebpackConfig },
  getConfig,
  rules,
  stage,
  reporter,
}, pluginOptions) => {
  // Must be validated by pluginOptionsSchema
  const options = pluginOptions as unknown as PluginOptions;

  let extension = '.linaria.css';
  if (typeof options.loaderOptions.extension === 'string') {
    extension = options.loaderOptions.extension;
  }

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

      // Allow overriding options
      ...options.loaderOptions,
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

  if (options.extractCritical && config.optimization) {
    if (extension === '.css') {
      reporter.panicOnBuild('A unique extension is required for the isolation of linaria stylesheets. consider prefixing it such as `.linaria.css`');
    }

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
      test: filename => filename.endsWith(extension),
      chunks: 'all',
      enforce: true,
      // Set priority grater than default group
      priority: styleGroupPriority + 1,
    };

    replaceWebpackConfig(newConfig);
  }
};
