import type { ReactNode, ReactElement } from 'react';

import { isValidElement } from 'react';

export const TS_RULE_TEST = '\\.tsx?$';

export const LINARIA_STYLESHEET_RULE = /\/linaria\.[\w\d]+\.css$/;

export function isLinariaStyleElement(node: ReactNode): node is ReactElement {
  return isValidElement(node) && node.type === 'style' && LINARIA_STYLESHEET_RULE.test(node.props['data-href']);
}
