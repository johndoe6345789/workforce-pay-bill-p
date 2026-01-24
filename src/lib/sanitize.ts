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

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return ''
  }
  
  return email
    .trim()
    .toLowerCase()
    .slice(0, 254)
}

export function sanitizeURL(url: string): string {
  if (typeof url !== 'string') {
    return ''
  }
  
  try {
    const parsed = new URL(url)
    
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    
    return parsed.href
  } catch {
    return ''
  }
}

export function sanitizeNumericInput(value: string | number): number | null {
  const num = typeof value === 'number' ? value : parseFloat(value)
  
  if (isNaN(num) || !isFinite(num)) {
    return null
  }
  
  return num
}

export function sanitizeInteger(value: string | number, min?: number, max?: number): number | null {
  const num = typeof value === 'number' ? Math.floor(value) : parseInt(value, 10)
  
  if (isNaN(num) || !isFinite(num)) {
    return null
  }
  
  if (min !== undefined && num < min) {
    return min
  }
  
  if (max !== undefined && num > max) {
    return max
  }
  
  return num
}

export function sanitizePhoneNumber(phone: string): string {
  if (typeof phone !== 'string') {
    return ''
  }
  
  return phone
    .replace(/[^0-9+() -]/g, '')
    .slice(0, 20)
}

export function sanitizePostalCode(postalCode: string): string {
  if (typeof postalCode !== 'string') {
    return ''
  }
  
  return postalCode
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .toUpperCase()
    .slice(0, 10)
}

export function sanitizeUsername(username: string): string {
  if (typeof username !== 'string') {
    return ''
  }
  
  return username
    .trim()
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .slice(0, 50)
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

export function sanitizeCSVValue(value: string): string {
  if (typeof value !== 'string') {
    return ''
  }
  
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  
  return value
}

export function sanitizeJSONString(jsonString: string): string {
  if (typeof jsonString !== 'string') {
    return ''
  }
  
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed)
  } catch {
    return ''
  }
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

export function sanitizeObjectKeys<T extends Record<string, any>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> {
  const sanitized: Partial<T> = {}
  
  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key as keyof T] = obj[key]
    }
  }
  
  return sanitized
}
