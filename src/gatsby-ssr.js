import React from 'react'
import { renderToString } from 'react-dom/server'
import { collect } from 'linaria/server'

const LINARIA_STYLESHEET_RULE = /\/linaria\.[\w\d]+\.css$/

let bodyHTML

export const replaceRenderer = ({ bodyComponent }) => {
  bodyHTML = renderToString(bodyComponent)
}

export const onPreRenderHTML = ({
  pathname,
  getHeadComponents,
  replaceHeadComponents,
  getPostBodyComponents,
  replacePostBodyComponents,
}) => {
  let styles = []
  const headComponents = getHeadComponents().filter(({ type, props }) => {
    if (type === 'style' && LINARIA_STYLESHEET_RULE.test(props['data-href'])) {
      styles.push({
        href: props['data-href'],
        text: props.dangerouslySetInnerHTML.__html,
      })
      return false
    }
    return true
  })
  const { critical } = collect(
    bodyHTML,
    styles.map(style => style.text).join('')
  )
  // Attach critical CSS into bottom of head
  replaceHeadComponents([
    ...headComponents,
    <style
      key="linaria-critical-css"
      data-linaria-critical={pathname}
      dangerouslySetInnerHTML={{ __html: critical }}
    />,
  ])
  // Attach other and critical into bottom of body
  // This also includes critical css because of cache hit
  replacePostBodyComponents([
    ...getPostBodyComponents(),
    styles
      .map(style => style.href)
      .map(href => (
        <link
          key={href}
          rel="prefetch stylesheet"
          type="text/css"
          href={href}
        />
      )),
  ])
}
