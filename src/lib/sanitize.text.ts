export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  const element = document.createElement('div')
  element.textContent = input
  return element.innerHTML
}

export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') {
    return ''
  }

  return query
    .trim()
    .replace(/[<>'"]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 200)
}

export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return 'file'
  }

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 255) || 'file'
}

export function stripHTML(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }

  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function escapeRegExp(string: string): string {
  if (typeof string !== 'string') {
    return ''
  }

  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function truncateString(str: string, maxLength: number, ellipsis = '...'): string {
  if (typeof str !== 'string') {
    return ''
  }

  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength - ellipsis.length) + ellipsis
}
