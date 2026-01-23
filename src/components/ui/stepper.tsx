import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: Array<{
    id: string
    label: string
    description?: string
  }>
  currentStep: number
  onStepClick?: (step: number) => void
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, onStepClick, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => {
              const isComplete = index < currentStep
              const isCurrent = index === currentStep
              const isClickable = onStepClick && index <= currentStep

              return (
                <li
                  key={step.id}
                  className={cn(
                    'relative flex-1',
                    index !== steps.length - 1 && 'pr-8 sm:pr-20'
                  )}
                >
                  {index !== steps.length - 1 && (
                    <div
                      className="absolute top-4 left-0 -ml-px w-full h-0.5"
                      aria-hidden="true"
                    >
                      <div
                        className={cn(
                          'h-full w-full',
                          isComplete ? 'bg-primary' : 'bg-border'
                        )}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      'group relative flex flex-col items-start',
                      isClickable && 'cursor-pointer',
                      !isClickable && 'cursor-default'
                    )}
                  >
                    <span className="flex h-9 items-center">
                      <span
                        className={cn(
                          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold',
                          isComplete &&
                            'border-primary bg-primary text-primary-foreground',
                          isCurrent &&
                            'border-primary bg-background text-primary',
                          !isComplete &&
                            !isCurrent &&
                            'border-border bg-background text-muted-foreground'
                        )}
                      >
                        {index + 1}
                      </span>
                    </span>
                    <span className="mt-2 flex min-w-0 flex-col text-left">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isCurrent ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {step.label}
                      </span>
                      {step.description && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'
