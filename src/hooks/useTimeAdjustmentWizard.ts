import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import type { TimeAndRateAdjustment } from '@/components/TimeAndRateAdjustmentWizard'

interface Timesheet { id: string; workerId: string; workerName: string; clientName: string; hoursWorked: number; rate: number; status: string }

export const ADJUSTMENT_REASONS = [
  { value: 'client_request', label: 'Client Request' },
  { value: 'worker_dispute', label: 'Worker Dispute' },
  { value: 'data_entry_error', label: 'Data Entry Error' },
  { value: 'contract_change', label: 'Contract Rate Change' },
  { value: 'overtime_adjustment', label: 'Overtime Adjustment' },
  { value: 'shift_premium', label: 'Shift Premium Applied' },
  { value: 'time_correction', label: 'Time Recording Correction' },
  { value: 'compliance_adjustment', label: 'Compliance Adjustment' },
  { value: 'other', label: 'Other (Specify in Notes)' },
]

export function useTimeAdjustmentWizard(timesheet: Timesheet | null, onSubmit: (adj: TimeAndRateAdjustment) => Promise<void>, onClose: () => void) {
  const [currentStep, setCurrentStep] = useState(0)
  const [adjustmentType, setAdjustmentType] = useState<'time' | 'rate' | 'both'>('time')
  const [adjustedHours, setAdjustedHours] = useState('')
  const [adjustedRate, setAdjustedRate] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculations = useMemo(() => {
    if (!timesheet) return { originalTotal: 0, newHours: 0, newRate: 0, newTotal: 0, difference: 0, percentageChange: '0', requiresApproval: false }
    const originalTotal = timesheet.hoursWorked * timesheet.rate
    const newHours = (adjustmentType === 'time' || adjustmentType === 'both') ? parseFloat(adjustedHours) || timesheet.hoursWorked : timesheet.hoursWorked
    const newRate = (adjustmentType === 'rate' || adjustmentType === 'both') ? parseFloat(adjustedRate) || timesheet.rate : timesheet.rate
    const newTotal = newHours * newRate
    const difference = newTotal - originalTotal
    const percentageChange = originalTotal !== 0 ? ((difference / originalTotal) * 100).toFixed(2) : '0'
    const requiresApproval = Math.abs(difference) > 100 || Math.abs(parseFloat(percentageChange)) > 10
    return { originalTotal, newHours, newRate, newTotal, difference, percentageChange, requiresApproval }
  }, [timesheet, adjustmentType, adjustedHours, adjustedRate])

  const steps = [
    { id: 'step-0', label: 'Select Type', description: 'Choose adjustment type', status: 0 < currentStep ? 'completed' as const : 0 === currentStep ? 'current' as const : 'pending' as const },
    { id: 'step-1', label: 'Enter Values', description: 'New time/rate values', status: 1 < currentStep ? 'completed' as const : 1 === currentStep ? 'current' as const : 'pending' as const },
    { id: 'step-2', label: 'Justification', description: 'Reason and notes', status: 2 < currentStep ? 'completed' as const : 2 === currentStep ? 'current' as const : 'pending' as const },
    { id: 'step-3', label: 'Review', description: 'Confirm changes', status: 3 < currentStep ? 'completed' as const : 3 === currentStep ? 'current' as const : 'pending' as const },
  ]

  const handleReset = () => { setCurrentStep(0); setAdjustmentType('time'); setAdjustedHours(''); setAdjustedRate(''); setAdjustmentReason(''); setNotes('') }
  const handleClose = () => { handleReset(); onClose() }
  const handlePrevious = () => setCurrentStep(p => Math.max(p - 1, 0))

  const handleNext = () => {
    if (currentStep === 1) {
      if ((adjustmentType === 'time' || adjustmentType === 'both') && !adjustedHours) { toast.error('Please enter adjusted hours'); return }
      if ((adjustmentType === 'rate' || adjustmentType === 'both') && !adjustedRate) { toast.error('Please enter adjusted rate'); return }
      const h = parseFloat(adjustedHours); const r = parseFloat(adjustedRate)
      if ((adjustmentType === 'time' || adjustmentType === 'both') && (isNaN(h) || h < 0)) { toast.error('Hours must be a valid positive number'); return }
      if ((adjustmentType === 'rate' || adjustmentType === 'both') && (isNaN(r) || r < 0)) { toast.error('Rate must be a valid positive number'); return }
    }
    if (currentStep === 2 && !adjustmentReason) { toast.error('Please select a reason for adjustment'); return }
    setCurrentStep(p => Math.min(p + 1, steps.length - 1))
  }

  const handleSubmit = async () => {
    if (!adjustmentReason || !timesheet) { toast.error('Please provide a reason for the adjustment'); return }
    setIsSubmitting(true)
    try {
      const adjustment: TimeAndRateAdjustment = {
        timesheetId: timesheet.id, workerId: timesheet.workerId, workerName: timesheet.workerName, clientName: timesheet.clientName,
        originalHours: timesheet.hoursWorked, originalRate: timesheet.rate,
        adjustedHours: (adjustmentType === 'time' || adjustmentType === 'both') ? parseFloat(adjustedHours) : undefined,
        adjustedRate: (adjustmentType === 'rate' || adjustmentType === 'both') ? parseFloat(adjustedRate) : undefined,
        adjustmentReason, adjustmentType, approvalRequired: calculations.requiresApproval, notes: notes || undefined,
      }
      await onSubmit(adjustment)
      toast.success(calculations.requiresApproval ? 'Adjustment submitted for approval' : 'Adjustment applied successfully')
      handleClose()
    } catch {
      toast.error('Failed to submit adjustment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep, steps, isSubmitting,
    adjustmentType, setAdjustmentType,
    adjustedHours, setAdjustedHours,
    adjustedRate, setAdjustedRate,
    adjustmentReason, setAdjustmentReason,
    notes, setNotes,
    calculations,
    handleClose, handleNext, handlePrevious, handleSubmit,
  }
}
