import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

export interface WizardStep {
  id: string
  title: string
  description?: string
  content: React.ReactNode
  validate?: () => boolean | Promise<boolean>
}

export interface WizardProps {
  steps: WizardStep[]
  onComplete?: (data: any) => void
  onCancel?: () => void
  className?: string
  showStepIndicator?: boolean
}

const Wizard = React.forwardRef<HTMLDivElement, WizardProps>(
  (
    {
      steps,
      onComplete,
      onCancel,
      className,
      showStepIndicator = true,
    },
    ref
  ) => {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
    const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
      new Set()
    )

    const currentStep = steps[currentStepIndex]
    const isFirstStep = currentStepIndex === 0
    const isLastStep = currentStepIndex === steps.length - 1

    const handleNext = async () => {
      if (currentStep.validate) {
        const isValid = await currentStep.validate()
        if (!isValid) return
      }

      setCompletedSteps((prev) => new Set(prev).add(currentStepIndex))

      if (isLastStep) {
        onComplete?.({})
      } else {
        setCurrentStepIndex((prev) => prev + 1)
      }
    }

    const handleBack = () => {
      if (!isFirstStep) {
        setCurrentStepIndex((prev) => prev - 1)
      }
    }

    const handleStepClick = (index: number) => {
      if (index < currentStepIndex || completedSteps.has(index)) {
        setCurrentStepIndex(index)
      }
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-6', className)}>
        {showStepIndicator && (
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index)
              const isCurrent = index === currentStepIndex
              const isAccessible = index <= currentStepIndex || isCompleted

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={cn(
                      'flex flex-col items-center gap-2 flex-1 group',
                      isAccessible && 'cursor-pointer',
                      !isAccessible && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                        isCompleted && 'bg-success border-success text-success-foreground',
                        isCurrent && 'bg-accent border-accent text-accent-foreground',
                        !isCompleted && !isCurrent && 'bg-muted border-border'
                      )}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="text-center">
                      <div
                        className={cn(
                          'text-sm font-medium',
                          isCurrent && 'text-foreground',
                          !isCurrent && 'text-muted-foreground'
                        )}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 flex-1 mt-5',
                        index < currentStepIndex ? 'bg-success' : 'bg-border'
                      )}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}

        <div className="flex-1">{currentStep.content}</div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {!isFirstStep && (
              <Button variant="outline" onClick={handleBack}>
                <CaretLeft className="mr-2" />
                Back
              </Button>
            )}
            {isFirstStep && onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          <Button onClick={handleNext}>
            {isLastStep ? 'Complete' : 'Next'}
            {!isLastStep && <CaretRight className="ml-2" />}
          </Button>
        </div>
      </div>
    )
  }
)
Wizard.displayName = 'Wizard'

export { Wizard }
