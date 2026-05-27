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

  return { isValid: errors.length === 0, errors }
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

  return { isValid: errors.length === 0, errors }
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

  return { isValid: errors.length === 0, errors }
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = []

  if (phone && !isValidPhoneNumber(phone)) {
    errors.push('Phone number format is invalid')
  }

  return { isValid: errors.length === 0, errors }
}

export function validateURL(url: string): ValidationResult {
  const errors: string[] = []

  if (url && !isValidURL(url)) {
    errors.push('URL format is invalid')
  }

  return { isValid: errors.length === 0, errors }
}
