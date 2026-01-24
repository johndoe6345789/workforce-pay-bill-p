import { LIMITS } from './constants'
import { isValidEmail, isValidPhoneNumber, isValidURL } from './type-guards'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required')
  } else if (!isValidEmail(email)) {
    errors.push('Email format is invalid')
  } else if (email.length > LIMITS.MAX_EMAIL_LENGTH) {
    errors.push(`Email must be less than ${LIMITS.MAX_EMAIL_LENGTH} characters`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Password is required')
  } else {
    if (password.length < LIMITS.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters`)
    }
    if (password.length > LIMITS.MAX_PASSWORD_LENGTH) {
      errors.push(`Password must be less than ${LIMITS.MAX_PASSWORD_LENGTH} characters`)
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = []
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required')
  } else {
    if (username.length > LIMITS.MAX_USERNAME_LENGTH) {
      errors.push(`Username must be less than ${LIMITS.MAX_USERNAME_LENGTH} characters`)
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, dots, hyphens, and underscores')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = []
  
  if (phone && !isValidPhoneNumber(phone)) {
    errors.push('Phone number format is invalid')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateURL(url: string): ValidationResult {
  const errors: string[] = []
  
  if (url && !isValidURL(url)) {
    errors.push('URL format is invalid')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateRequired(value: string | number | null | undefined, fieldName: string): ValidationResult {
  const errors: string[] = []
  
  if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
    errors.push(`${fieldName} is required`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateNumber(value: number, min?: number, max?: number, fieldName?: string): ValidationResult {
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
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateDate(date: string | Date, fieldName?: string): ValidationResult {
  const errors: string[] = []
  const name = fieldName || 'Date'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    errors.push(`${name} must be a valid date`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateDateRange(startDate: string | Date, endDate: string | Date): ValidationResult {
  const errors: string[] = []
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  const startValidation = validateDate(start, 'Start date')
  const endValidation = validateDate(end, 'End date')
  
  if (!startValidation.isValid) {
    errors.push(...startValidation.errors)
  }
  
  if (!endValidation.isValid) {
    errors.push(...endValidation.errors)
  }
  
  if (startValidation.isValid && endValidation.isValid && start > end) {
    errors.push('Start date must be before end date')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateFileSize(file: File, maxSizeMB: number = LIMITS.MAX_FILE_SIZE_MB): ValidationResult {
  const errors: string[] = []
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  const errors: string[] = []
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateLength(
  value: string,
  min?: number,
  max?: number,
  fieldName?: string
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
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePattern(value: string, pattern: RegExp, errorMessage: string): ValidationResult {
  const errors: string[] = []
  
  if (!pattern.test(value)) {
    errors.push(errorMessage)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function combineValidations(...validations: ValidationResult[]): ValidationResult {
  const allErrors = validations.flatMap(v => v.errors)
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}

export function validateFormData<T extends Record<string, any>>(
  data: T,
  validators: Partial<Record<keyof T, (value: any) => ValidationResult>>
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}
  
  for (const [field, validator] of Object.entries(validators)) {
    if (validator && typeof validator === 'function') {
      const result = validator(data[field])
      if (!result.isValid) {
        errors[field] = result.errors
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
