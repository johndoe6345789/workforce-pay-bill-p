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

export function sanitizeUsername(username: string): string {
  if (typeof username !== 'string') {
    return ''
  }

  return username
    .trim()
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .slice(0, 50)
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
    const parsed: unknown = JSON.parse(jsonString)
    return JSON.stringify(parsed)
  } catch {
    return ''
  }
}

export function sanitizeObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> {
  const sanitized: Partial<T> = {}

  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key as keyof T] = obj[key] as T[keyof T]
    }
  }

  return sanitized
}
