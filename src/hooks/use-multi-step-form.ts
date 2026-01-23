import { useState, useCallback } from 'react'

export interface UseMultiStepFormOptions<T> {
  initialData: T
  steps: string[]
  onComplete?: (data: T) => void | Promise<void>
}

export function useMultiStepForm<T extends Record<string, any>>({
  initialData,
  steps,
  onComplete
}: UseMultiStepFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const updateData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      clearAllErrors()
    }
  }, [currentStep, steps.length, clearAllErrors])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      clearAllErrors()
    }
  }, [currentStep, clearAllErrors])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
      clearAllErrors()
    }
  }, [steps.length, clearAllErrors])

  const handleSubmit = useCallback(async () => {
    if (!onComplete) return

    setIsSubmitting(true)
    try {
      await onComplete(formData)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onComplete])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setFormData(initialData)
    setErrors({})
    setIsSubmitting(false)
  }, [initialData])

  return {
    currentStep,
    currentStepName: steps[currentStep],
    formData,
    errors,
    isSubmitting,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
    progress: ((currentStep + 1) / steps.length) * 100,
    updateData,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    reset
  }
}
