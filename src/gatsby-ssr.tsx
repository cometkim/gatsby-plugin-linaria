import type { ReactNode, ReactElement } from 'react';
import type { ReplaceRendererArgs, PreRenderHTMLArgs } from 'gatsby';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { collect } from 'linaria/server';

import { isLinariaStyleElement } from './utils';

let bodyHTML: string;

export const replaceRenderer = ({ bodyComponent }: ReplaceRendererArgs) => {
  bodyHTML = renderToString(bodyComponent as ReactElement);
};

export const onPreRenderHTML = ({
  pathname,
  getHeadComponents,
  replaceHeadComponents,
  getPostBodyComponents,
  replacePostBodyComponents,
}: PreRenderHTMLArgs) => {
  const headComponents = getHeadComponents();

  type LinariaStyleSheet = {
    href: string,
    text: string,
  }
  const linariaStyleSheets: LinariaStyleSheet[] = [];
  const otherElements: ReactNode[] = [];

  for (const element of headComponents) {
    if (isLinariaStyleElement(element)) {
      linariaStyleSheets.push({
        href: element.props['data-href'],
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
