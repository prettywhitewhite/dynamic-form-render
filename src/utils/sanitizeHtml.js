import sanitizeHtml from 'sanitize-html'

function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      'img',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'nl',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'thead',
      'caption',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
    },
    selfClosing: [
      'img',
      'br',
      'hr',
      'area',
      'base',
      'basefont',
      'input',
      'link',
      'meta',
    ],
    allowedSchemes: ['data', 'http', 'https', 'ftp', 'mailto'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
  })
}

export default sanitize
export {sanitize, sanitizeHtml}
