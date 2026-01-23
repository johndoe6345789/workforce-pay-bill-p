import { useState, useCallback } from 'react'

export type Step = {
  id: string
  title: string
  description?: string
  isComplete?: boolean
}

export function useWizard(steps: Step[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [isLastStep])

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [isFirstStep])

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index)
    }
  }, [steps.length])

  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set(prev).add(stepId))
  }, [])

  const isStepComplete = useCallback((stepId: string) => {
    return completedSteps.has(stepId)
  }, [completedSteps])

  const reset = useCallback(() => {
    setCurrentStepIndex(0)
    setCompletedSteps(new Set())
  }, [])

  return {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    markStepComplete,
    isStepComplete,
    reset,
    progress: ((currentStepIndex + 1) / steps.length) * 100
  }
}
