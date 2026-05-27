import { LIMITS } from './constants'
import type { ValidationResult } from './validation.identity'

export function validateFileSize(
  file: File,
  maxSizeMB: number = LIMITS.MAX_FILE_SIZE_MB,
): ValidationResult {
  const errors: string[] = []

  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`)
  }

  return { isValid: errors.length === 0, errors }
}

export function validateFileType(
  file: File, allowedTypes: string[],
): ValidationResult {
  const errors: string[] = []
  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`)
  }

  return { isValid: errors.length === 0, errors }
}

export function validateLength(
  value: string,
  min?: number,
  max?: number,
  fieldName?: string,
): ValidationResult {
  const errors: string[] = []
  const name = fieldName || 'Value'

  if (typeof value !== 'string') {
    errors.push(`${name} must be a string`)
    return { isValid: false, errors }
  }

  if (min !== undefined && value.length < min) {
    errors.push(`${name} must be at least ${min} characters`)
  }

  if (max !== undefined && value.length > max) {
    errors.push(`${name} must be at most ${max} characters`)
  }

  return { isValid: errors.length === 0, errors }
}

export function validateFormData<T extends Record<string, unknown>>(
  data: T,
  validators: Partial<Record<keyof T, (value: unknown) => ValidationResult>>,
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}

  for (const [field, validator] of Object.entries(validators)) {
    if (validator && typeof validator === 'function') {
      const result = validator(data[field as keyof T])
      if (!result.isValid) {
        errors[field] = result.errors
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
