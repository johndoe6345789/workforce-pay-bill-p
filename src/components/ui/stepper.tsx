import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from '@phosphor-icons/react'

export interface Step {
  id: string
  label: string
  description?: string
  status: 'pending' | 'current' | 'completed' | 'error'
}

export interface StepperProps {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({ steps, orientation = 'horizontal', className }: StepperProps) {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepItem step={step} index={index} orientation={orientation} />
          {index < steps.length - 1 && (
            <StepConnector orientation={orientation} completed={step.status === 'completed'} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function StepItem({
  step,
  index,
  orientation
}: {
  step: Step
  index: number
  orientation: 'horizontal' | 'vertical'
}) {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-start gap-4'
      )}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
            step.status === 'completed' && 'border-success bg-success text-success-foreground',
            step.status === 'current' && 'border-primary bg-primary text-primary-foreground',
            step.status === 'pending' && 'border-muted bg-background text-muted-foreground',
            step.status === 'error' && 'border-destructive bg-destructive text-destructive-foreground'
          )}
        >
          {step.status === 'completed' ? (
            <CheckCircle size={20} weight="fill" />
          ) : (
            <span className="text-sm font-medium">{index + 1}</span>
          )}
        </div>
      </div>
      <div className={cn('flex flex-col', orientation === 'horizontal' ? 'items-center mt-2' : '')}>
        <span
          className={cn(
            'text-sm font-medium',
            step.status === 'current' && 'text-foreground',
            step.status === 'completed' && 'text-foreground',
            step.status === 'pending' && 'text-muted-foreground'
          )}
        >
          {step.label}
        </span>
        {step.description && (
          <span className="text-xs text-muted-foreground">{step.description}</span>
        )}
      </div>
    </div>
  )
}

function StepConnector({
  orientation,
  completed
}: {
  orientation: 'horizontal' | 'vertical'
  completed: boolean
}) {
  return (
    <div
      className={cn(
        'bg-muted',
        orientation === 'horizontal' ? 'h-0.5 flex-1 mx-2' : 'w-0.5 h-8 ml-5'
      )}
    >
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ width: 0, height: 0 }}
            animate={
              orientation === 'horizontal'
                ? { width: '100%', height: '100%' }
                : { width: '100%', height: '100%' }
            }
            className="bg-success h-full w-full"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
