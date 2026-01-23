import * as React from 'react'
import { cn } from '@/lib/utils'

export interface Step {
  label: string
  description?: string
  status?: 'completed' | 'current' | 'upcoming' | 'error'
  icon?: React.ReactNode
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
  currentStep?: number
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    { steps, orientation = 'horizontal', currentStep = 0, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'horizontal' && 'flex items-center',
          orientation === 'vertical' && 'flex flex-col',
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const status =
            step.status ||
            (index < currentStep
              ? 'completed'
              : index === currentStep
              ? 'current'
              : 'upcoming')

          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'flex items-center gap-3',
                  orientation === 'vertical' && 'flex-col items-start'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                      status === 'completed' &&
                        'border-success bg-success text-success-foreground',
                      status === 'current' &&
                        'border-accent bg-accent text-accent-foreground',
                      status === 'upcoming' &&
                        'border-border bg-muted text-muted-foreground',
                      status === 'error' &&
                        'border-destructive bg-destructive text-destructive-foreground'
                    )}
                  >
                    {step.icon || (status === 'completed' ? '✓' : index + 1)}
                  </div>
                  <div>
                    <div
                      className={cn(
                        'text-sm font-medium',
                        status === 'current' && 'text-foreground',
                        status !== 'current' && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </div>
                    {step.description && (
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    orientation === 'horizontal' && 'h-0.5 flex-1 mx-4',
                    orientation === 'vertical' && 'w-0.5 h-8 ml-5',
                    index < currentStep ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)
Stepper.displayName = 'Stepper'

export { Stepper }
