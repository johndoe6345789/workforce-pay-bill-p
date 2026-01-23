import { useState, useCallback } from 'react'

export interface UseStepsReturn {
  currentStep: number
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  reset: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
}

export function useSteps(totalSteps: number, initialStep = 0): UseStepsReturn {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
  }, [totalSteps])

  const reset = useCallback(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    reset,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrevious: currentStep > 0,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100
  }
}
