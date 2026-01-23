import * as React from 'react'
import { cn } from '@/lib/utils'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

export interface Step {
  id: string
  label: string
  description?: string
  optional?: boolean
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'compact' | 'dots'
  className?: string
  allowSkip?: boolean
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  variant = 'default',
  allowSkip = false,
  className
}: StepperProps) {
  const isVertical = orientation === 'vertical'
  const isDots = variant === 'dots'
  const isCompact = variant === 'compact'

  const handleStepClick = (index: number) => {
    if (!onStepClick) return
    if (!allowSkip && index > currentStep) return
    onStepClick(index)
  }

  if (isDots) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isClickable = allowSkip || index <= currentStep

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={!isClickable || !onStepClick}
              className={cn(
                'h-2 rounded-full transition-all',
                isActive && 'w-8 bg-primary',
                isCompleted && 'w-2 bg-success',
                !isActive && !isCompleted && 'w-2 bg-muted',
                isClickable && 'cursor-pointer hover:opacity-70',
                !isClickable && 'cursor-not-allowed'
              )}
              aria-label={step.label}
              aria-current={isActive ? 'step' : undefined}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex',
        isVertical ? 'flex-col' : 'flex-row items-start',
        isCompact && !isVertical && 'items-center',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isLast = index === steps.length - 1
        const isClickable = allowSkip || index <= currentStep

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex',
                isVertical ? 'flex-row gap-3' : 'flex-col items-center gap-2',
                isCompact && 'gap-1'
              )}
            >
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable || !onStepClick}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors',
                  isActive && 'border-primary bg-primary text-primary-foreground',
                  isCompleted && 'border-success bg-success text-success-foreground',
                  !isActive && !isCompleted && 'border-muted bg-background text-muted-foreground',
                  isClickable && 'cursor-pointer hover:opacity-80',
                  !isClickable && 'cursor-not-allowed',
                  isCompact && 'h-8 w-8 text-sm'
                )}
                aria-label={step.label}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className={isCompact ? 'text-xs' : 'text-sm'}>
                    {index + 1}
                  </span>
                )}
              </button>

              {!isCompact && (
                <div
                  className={cn(
                    'flex flex-col',
                    isVertical ? 'flex-1' : 'items-center text-center max-w-[120px]'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isActive && 'text-foreground',
                      !isActive && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </span>
                  )}
                  {step.optional && (
                    <span className="text-xs text-muted-foreground italic mt-0.5">
                      Optional
                    </span>
                  )}
                </div>
              )}
            </div>

            {!isLast && (
              <div
                className={cn(
                  'flex items-center justify-center',
                  isVertical ? 'h-8 w-10 ml-5' : 'flex-1 h-0.5 mx-2',
                  isCompact && !isVertical && 'mx-1'
                )}
              >
                {isVertical ? (
                  <div className="h-full w-0.5 bg-border" />
                ) : (
                  <div className="h-full w-full bg-border" />
                )}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export interface StepperNavProps {
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onPrevious?: () => void
  onComplete?: () => void
  nextLabel?: string
  previousLabel?: string
  completeLabel?: string
  disableNext?: boolean
  disablePrevious?: boolean
  className?: string
}

export function StepperNav({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  completeLabel = 'Complete',
  disableNext = false,
  disablePrevious = false,
  className
}: StepperNavProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <button
        onClick={onPrevious}
        disabled={isFirst || disablePrevious}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          'transition-colors'
        )}
      >
        <CaretLeft size={16} weight="bold" />
        {previousLabel}
      </button>

      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>

      {isLast ? (
        <button
          onClick={onComplete}
          disabled={disableNext}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:pointer-events-none disabled:opacity-50',
            'transition-colors'
          )}
        >
          {completeLabel}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={disableNext}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:pointer-events-none disabled:opacity-50',
            'transition-colors'
          )}
        >
          {nextLabel}
          <CaretRight size={16} weight="bold" />
        </button>
      )}
    </div>
  )
}
