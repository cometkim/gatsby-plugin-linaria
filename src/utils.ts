import type { ReactNode, ReactElement } from 'react';

import { isValidElement } from 'react';

export type PluginOptions = {
  /**
   * @default false
   */
  extractCritical: boolean,

  /**
   * Linaria loader options
   *
   * @see https://github.com/callstack/linaria/blob/master/docs/BUNDLERS_INTEGRATION.md#options
   * @default empty (use linaria's default)
   */
  loaderOptions: Record<string, unknown>,
};

export const TS_RULE_TEST = '\\.tsx?$';

// Splitted by optimization.splitChunks.cacheGroup.linaria options
export const LINARIA_STYLESHEET_RULE = /\/linaria\.[\w\d]+\.css$/;

export function isLinariaStyleElement(node: ReactNode): node is ReactElement {
  return isValidElement(node) &&
    node.type === 'style' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    LINARIA_STYLESHEET_RULE.test(node.props['data-href']);
}
