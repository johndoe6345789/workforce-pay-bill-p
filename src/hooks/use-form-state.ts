import { useState, useCallback } from 'react'

export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isDirty, setIsDirty] = useState(false)

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }, [])

  const setFieldError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback(<K extends keyof T>(field: K) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const touchField = useCallback(<K extends keyof T>(field: K) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const handleChange = useCallback(<K extends keyof T>(field: K) => {
    return (value: T[K]) => {
      setValue(field, value)
      clearFieldError(field)
    }
  }, [setValue, clearFieldError])

  const handleBlur = useCallback(<K extends keyof T>(field: K) => {
    return () => {
      touchField(field)
    }
  }, [touchField])

  const reset = useCallback(() => {
    setValues(initialState)
    setErrors({})
    setTouched({})
    setIsDirty(false)
  }, [initialState])

  const setAllValues = useCallback((newValues: T) => {
    setValues(newValues)
    setIsDirty(true)
  }, [])

  const hasErrors = Object.keys(errors).length > 0

  return {
    values,
    errors,
    touched,
    isDirty,
    hasErrors,
    setValue,
    setFieldError,
    clearFieldError,
    touchField,
    handleChange,
    handleBlur,
    reset,
    setAllValues
  }
}
