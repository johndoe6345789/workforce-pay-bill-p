import { useState, useCallback } from 'react'

export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

export interface FieldConfig<T> {
  value: T
  rules?: ValidationRule<T>[]
}

export function useValidation<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback((name: keyof T, value: any, rules?: ValidationRule<any>[]) => {
    if (!rules || rules.length === 0) return ''

    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message
      }
    }
    return ''
  }, [])

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const setTouchedField = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const validate = useCallback((fields: Partial<Record<keyof T, ValidationRule<any>[]>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.entries(fields).forEach(([name, rules]) => {
      const error = validateField(name as keyof T, values[name as keyof T], rules as ValidationRule<any>[])
      if (error) {
        newErrors[name as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouchedField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}
