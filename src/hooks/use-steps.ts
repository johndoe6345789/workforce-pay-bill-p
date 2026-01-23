import { useState, useCallback } from 'react'

export interface UseStepsOptions {
  initialStep?: number
  totalSteps: number
}

export function useSteps({ initialStep = 0, totalSteps }: UseStepsOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }, [totalSteps])

  const reset = useCallback(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  return {
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
    nextStep,
    previousStep,
    goToStep,
    reset,
    setStep: setCurrentStep
  }
}
