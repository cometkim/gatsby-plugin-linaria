import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import type { GatsbySSR } from 'gatsby';
import { collect } from '@linaria/server';

import {
  isLinariaStyleElement,
  type PluginOptions,
} from './utils';

let bodyHTML: string;

export const replaceRenderer: GatsbySSR['replaceRenderer'] = ({ bodyComponent }) => {
  bodyHTML = ReactDOM.renderToString(bodyComponent as React.ReactElement);
};

export const onPreRenderHTML: GatsbySSR['onPreRenderHTML'] = ({
  pathname,
  getHeadComponents,
  replaceHeadComponents,
  getPostBodyComponents,
  replacePostBodyComponents,
}, pluginOptions) => {
  // Must be validated by pluginOptionsSchema
  const options = pluginOptions as unknown as PluginOptions;
  if (!options.extractCritical) {
    return;
  }

  const headComponents = getHeadComponents();

  type LinariaStyleSheet = {
    href: string,
    text: string,
  };
  const linariaStyleSheets: LinariaStyleSheet[] = [];
  const otherElements: React.ReactNode[] = [];

  for (const element of headComponents) {
    if (isLinariaStyleElement(element)) {
      linariaStyleSheets.push({
        // eslint-disable-next-line
        href: element.props['data-href'],
        // eslint-disable-next-line
        text: element.props.dangerouslySetInnerHTML.__html,
      });
    } else {
      otherElements.push(element);
    }
  }

  const { critical } = collect(
    bodyHTML,
    linariaStyleSheets.map(style => style.text).join(''),
  );

  // Attach critical CSS into bottom of head
  replaceHeadComponents([
    ...otherElements,
    <style
      key="linaria-critical-css"
      data-linaria-critical={pathname}
      dangerouslySetInnerHTML={{ __html: critical }}
    />,
  ]);
  // Attach other and critical into bottom of body
  // This also includes critical css because of cache hit
  replacePostBodyComponents([
    ...getPostBodyComponents(),
    linariaStyleSheets
      .map(style => style.href)
      .map(href => (
        <link key={href} rel="stylesheet" type="text/css" href={href} />
      )),
  ]);
};
