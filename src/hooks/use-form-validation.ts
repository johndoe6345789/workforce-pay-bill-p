import { useState, useCallback } from 'react'

export type FormErrors<T> = Partial<Record<keyof T, string>>

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, (value: any) => string | undefined>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback((name: keyof T, value: any): string | undefined => {
    const validator = validationRules[name]
    return validator ? validator(value) : undefined
  }, [validationRules])

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {}
    let isValid = true

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T])
      if (error) {
        newErrors[key as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validationRules, values, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues
  }
}
