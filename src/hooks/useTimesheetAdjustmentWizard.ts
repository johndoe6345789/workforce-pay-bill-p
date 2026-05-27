import { useState } from 'react'
import { toast } from 'sonner'
import type { Timesheet, TimesheetAdjustment } from '@/lib/types'

export type WizardStep = 'review' | 'adjust' | 'reason' | 'confirm'
export const WIZARD_STEPS: WizardStep[] = ['review', 'adjust', 'reason', 'confirm']

export function useTimesheetAdjustmentWizard(
  timesheet: Timesheet,
  onAdjust: (timesheetId: string, adjustment: Partial<TimesheetAdjustment>) => void,
  onOpenChange: (open: boolean) => void
) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('review')
  const [newHours, setNewHours] = useState(timesheet.hours.toString())
  const [newRate, setNewRate] = useState((timesheet.rate || 0).toString())
  const [reason, setReason] = useState('')
  const [issueCredit, setIssueCredit] = useState(true)

  const originalAmount = timesheet.amount
  const newAmount = parseFloat(newHours) * parseFloat(newRate)
  const difference = newAmount - originalAmount
  const percentageChange = originalAmount > 0 ? ((difference / originalAmount) * 100) : 0

  const isValid = () => {
    const h = parseFloat(newHours), r = parseFloat(newRate)
    return !isNaN(h) && h > 0 && !isNaN(r) && r > 0
  }

  const handleNext = () => {
    const idx = WIZARD_STEPS.indexOf(currentStep)
    if (idx < WIZARD_STEPS.length - 1) setCurrentStep(WIZARD_STEPS[idx + 1])
  }

  const handleBack = () => {
    const idx = WIZARD_STEPS.indexOf(currentStep)
    if (idx > 0) setCurrentStep(WIZARD_STEPS[idx - 1])
  }

  const handleSubmit = () => {
    if (!reason.trim()) { toast.error('Please provide a reason for the adjustment'); return }
    const adjustment: Partial<TimesheetAdjustment> = {
      previousHours: timesheet.hours,
      newHours: parseFloat(newHours),
      previousRate: timesheet.rate,
      newRate: parseFloat(newRate),
      reason,
      adjustedBy: 'Admin User'
    }
    onAdjust(timesheet.id, adjustment)
    if (issueCredit && difference < 0) {
      toast.success(`Adjustment saved. Credit note will be generated for £${Math.abs(difference).toFixed(2)}`)
    } else if (difference > 0) {
      toast.success(`Adjustment saved. Additional invoice will be generated for £${difference.toFixed(2)}`)
    } else {
      toast.success('Adjustment saved successfully')
    }
    onOpenChange(false)
    setTimeout(() => {
      setCurrentStep('review')
      setNewHours(timesheet.hours.toString())
      setNewRate((timesheet.rate || 0).toString())
      setReason('')
    }, 300)
  }

  const currentStepIndex = WIZARD_STEPS.indexOf(currentStep)

  return {
    currentStep, currentStepIndex,
    newHours, setNewHours,
    newRate, setNewRate,
    reason, setReason,
    issueCredit, setIssueCredit,
    originalAmount, newAmount, difference, percentageChange,
    isValid, handleNext, handleBack, handleSubmit,
  }
}
