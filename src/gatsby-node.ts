import type * as Webpack from 'webpack';
import type { GatsbyNode } from 'gatsby';

import type { PluginOptions } from './utils';

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
  const options = pluginOptions as unknown as PluginOptions;
  const isDevelop = stage.includes('develop');

  const linariaLoader: Webpack.RuleSetUseItem = {
    loader: '@linaria/webpack-loader',
    options: {
      sourceMap: isDevelop,
      displayName: isDevelop,
      babelOptions: {
        presets: ['babel-preset-gatsby'],
      },
      // Allow overriding options
      ...options.loaderOptions,
    },
  };

  setWebpackConfig({
    module: {
      rules: [
        {
          ...rules.js(),
          use: [linariaLoader],
        },
      ],
    },
  });

  const config = getConfig() as Webpack.Configuration;
  if (options.extractCritical && config.optimization) {
    let extension = '.linaria.css';
    if (typeof options.loaderOptions.extension === 'string') {
      extension = options.loaderOptions.extension;
    }
    if (extension === '.css') {
      reporter.panicOnBuild('A unique extension is required for the isolation of linaria stylesheets. consider prefixing it such as `.linaria.css`');
    }

    const { cacheGroups = {} } = config.optimization.splitChunks || {};

    if (typeof cacheGroups.styles !== 'object') {
      return;
    }
    if (cacheGroups.styles instanceof RegExp) {
      return;
    }

    // Set priority grater than default group
    const priority = (cacheGroups.styles.priority as number) + 1 || 65536;

    cacheGroups.linaria = {
      name: 'linaria',
      test: module => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Webpack's type definition lies
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        return Boolean(module.issuer?.matchResource?.endsWith(extension));
      },
      chunks: 'all',
      enforce: true,
      priority,
    };

    replaceWebpackConfig(config);
  }
};
