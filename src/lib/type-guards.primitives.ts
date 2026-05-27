export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

export function isValidDateString(dateString: unknown): dateString is string {
  if (typeof dateString !== 'string') return false
  const date = new Date(dateString)
  return isValidDate(date)
}

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: unknown): phone is string {
  if (typeof phone !== 'string') return false
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

export function isValidURL(url: unknown): url is string {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && isFinite(value)
}

export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && isFinite(value)
}

export function isValidCurrency(currency: unknown): currency is string {
  if (typeof currency !== 'string') return false
  return /^[A-Z]{3}$/.test(currency)
}
