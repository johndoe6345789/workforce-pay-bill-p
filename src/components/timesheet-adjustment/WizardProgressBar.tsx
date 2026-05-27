import { CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { WIZARD_STEPS, type WizardStep } from '@/hooks/useTimesheetAdjustmentWizard'

interface Props {
  currentStep: WizardStep
}

export function WizardProgressBar({ currentStep }: Props) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep)

  return (
    <div className="flex items-center justify-between mb-6">
      {WIZARD_STEPS.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              currentStep === step ? 'bg-accent text-accent-foreground' :
              currentIndex > index ? 'bg-success text-success-foreground' :
              'bg-muted text-muted-foreground'
            )}>
              {currentIndex > index ? <CheckCircle size={16} weight="fill" /> : index + 1}
            </div>
            <span className={cn('text-sm font-medium hidden md:block', currentStep === step ? 'text-foreground' : 'text-muted-foreground')}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          </div>
          {index < WIZARD_STEPS.length - 1 && (
            <div className={cn('flex-1 h-0.5 mx-2', currentIndex > index ? 'bg-success' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
