import type { ValidationResult } from './validation.identity'

export function validateRequired(
  value: string | number | null | undefined,
  fieldName: string,
): ValidationResult {
  const errors: string[] = []

  if (value === null || value === undefined ||
      (typeof value === 'string' && value.trim().length === 0)) {
    errors.push(`${fieldName} is required`)
  }

  return { isValid: errors.length === 0, errors }
}

export function validateNumber(
  value: number,
  min?: number,
  max?: number,
  fieldName?: string,
): ValidationResult {
  const errors: string[] = []
  const name = fieldName || 'Value'

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    errors.push(`${name} must be a valid number`)
  } else {
    if (min !== undefined && value < min) {
      errors.push(`${name} must be at least ${min}`)
    }
    if (max !== undefined && value > max) {
      errors.push(`${name} must be at most ${max}`)
    }
  }

  return { isValid: errors.length === 0, errors }
}

export function validateDate(
  date: string | Date, fieldName?: string,
): ValidationResult {
  const errors: string[] = []
  const name = fieldName || 'Date'
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    errors.push(`${name} must be a valid date`)
  }

  return { isValid: errors.length === 0, errors }
}

export function validateDateRange(
  startDate: string | Date,
  endDate: string | Date,
): ValidationResult {
  const errors: string[] = []
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const startValidation = validateDate(start, 'Start date')
  const endValidation = validateDate(end, 'End date')

  if (!startValidation.isValid) errors.push(...startValidation.errors)
  if (!endValidation.isValid) errors.push(...endValidation.errors)

  if (startValidation.isValid && endValidation.isValid && start > end) {
    errors.push('Start date must be before end date')
  }

  return { isValid: errors.length === 0, errors }
}

export function validatePattern(
  value: string, pattern: RegExp, errorMessage: string,
): ValidationResult {
  const errors: string[] = []
  if (!pattern.test(value)) errors.push(errorMessage)
  return { isValid: errors.length === 0, errors }
}

export function combineValidations(
  ...validations: ValidationResult[]
): ValidationResult {
  const allErrors = validations.flatMap(v => v.errors)
  return { isValid: allErrors.length === 0, errors: allErrors }
}
