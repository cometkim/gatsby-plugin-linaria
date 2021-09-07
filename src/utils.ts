import type { ReactNode, ReactElement } from 'react';

import { isValidElement } from 'react';

export type PluginOptions = {
  extractCritical: boolean,
  cacheDirectory: string,
  extension: string,
  preprocessor: 'none' | 'stylis' | ((selector: string, cssText: string) => string),
};

export const TS_RULE_TEST = '\\.tsx?$';

export const LINARIA_STYLESHEET_RULE = /\/linaria\.[\w\d]+\.css$/;

export const LINARIA_OPTIONS_CACHE_DIRECTORY_DEFAULT = '.linaria-cache';

export const LINARIA_OPTIONS_EXTENSION_DEFAULT = '.linaria.css';

export const LINARIA_OPTIONS_PREPROCESSOR_DEFAULT = 'stylis';

export function isLinariaStyleElement(node: ReactNode): node is ReactElement {
  return isValidElement(node) &&
    node.type === 'style' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    LINARIA_STYLESHEET_RULE.test(node.props['data-href']);
}
