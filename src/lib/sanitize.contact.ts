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
