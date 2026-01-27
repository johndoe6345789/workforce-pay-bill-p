import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stepper } from '@/components/ui/stepper'
import { ArrowLeft, ArrowRight, Clock, CurrencyDollar, FileText, CheckCircle, WarningCircle, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface TimeAndRateAdjustment {
  timesheetId: string
  workerId: string
  workerName: string
  clientName: string
  originalHours: number
  originalRate: number
  adjustedHours?: number
  adjustedRate?: number
  adjustmentReason: string
  adjustmentType: 'time' | 'rate' | 'both'
  approvalRequired: boolean
  notes?: string
}

interface TimeAndRateAdjustmentWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timesheet: {
    id: string
    workerId: string
    workerName: string
    clientName: string
    hoursWorked: number
    rate: number
    status: string
  } | null
  onSubmit: (adjustment: TimeAndRateAdjustment) => Promise<void>
}

const ADJUSTMENT_REASONS = [
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

export function TimeAndRateAdjustmentWizard({
  open,
  onOpenChange,
  timesheet,
  onSubmit
}: TimeAndRateAdjustmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [adjustmentType, setAdjustmentType] = useState<'time' | 'rate' | 'both'>('time')
  const [adjustedHours, setAdjustedHours] = useState<string>('')
  const [adjustedRate, setAdjustedRate] = useState<string>('')
  const [adjustmentReason, setAdjustmentReason] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stepDefinitions = [
    { title: 'Select Type', description: 'Choose adjustment type' },
    { title: 'Enter Values', description: 'New time/rate values' },
    { title: 'Justification', description: 'Reason and notes' },
    { title: 'Review', description: 'Confirm changes' },
  ]

  const steps = stepDefinitions.map((step, index) => ({
    id: `step-${index}`,
    label: step.title,
    description: step.description,
    status: index < currentStep ? 'completed' as const : index === currentStep ? 'current' as const : 'pending' as const,
  }))

  if (!timesheet) return null

  const originalTotal = timesheet.hoursWorked * timesheet.rate
  const newHours = adjustmentType === 'time' || adjustmentType === 'both' 
    ? parseFloat(adjustedHours) || timesheet.hoursWorked 
    : timesheet.hoursWorked
  const newRate = adjustmentType === 'rate' || adjustmentType === 'both'
    ? parseFloat(adjustedRate) || timesheet.rate
    : timesheet.rate
  const newTotal = newHours * newRate
  const difference = newTotal - originalTotal
  const percentageChange = ((difference / originalTotal) * 100).toFixed(2)

  const requiresApproval = Math.abs(difference) > 100 || Math.abs(parseFloat(percentageChange)) > 10

  const handleReset = () => {
    setCurrentStep(0)
    setAdjustmentType('time')
    setAdjustedHours('')
    setAdjustedRate('')
    setAdjustmentReason('')
    setNotes('')
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  const handleNext = () => {
    if (currentStep === 0 && !adjustmentType) {
      toast.error('Please select an adjustment type')
      return
    }

    if (currentStep === 1) {
      if ((adjustmentType === 'time' || adjustmentType === 'both') && !adjustedHours) {
        toast.error('Please enter adjusted hours')
        return
      }
      if ((adjustmentType === 'rate' || adjustmentType === 'both') && !adjustedRate) {
        toast.error('Please enter adjusted rate')
        return
      }
      const hours = parseFloat(adjustedHours)
      const rate = parseFloat(adjustedRate)
      if ((adjustmentType === 'time' || adjustmentType === 'both') && (isNaN(hours) || hours < 0)) {
        toast.error('Hours must be a valid positive number')
        return
      }
      if ((adjustmentType === 'rate' || adjustmentType === 'both') && (isNaN(rate) || rate < 0)) {
        toast.error('Rate must be a valid positive number')
        return
      }
    }

    if (currentStep === 2 && !adjustmentReason) {
      toast.error('Please select a reason for adjustment')
      return
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!adjustmentReason) {
      toast.error('Please provide a reason for the adjustment')
      return
    }

    setIsSubmitting(true)
    try {
      const adjustment: TimeAndRateAdjustment = {
        timesheetId: timesheet.id,
        workerId: timesheet.workerId,
        workerName: timesheet.workerName,
        clientName: timesheet.clientName,
        originalHours: timesheet.hoursWorked,
        originalRate: timesheet.rate,
        adjustedHours: adjustmentType === 'time' || adjustmentType === 'both' 
          ? parseFloat(adjustedHours) 
          : undefined,
        adjustedRate: adjustmentType === 'rate' || adjustmentType === 'both'
          ? parseFloat(adjustedRate)
          : undefined,
        adjustmentReason,
        adjustmentType,
        approvalRequired: requiresApproval,
        notes: notes || undefined,
      }

      await onSubmit(adjustment)
      toast.success(requiresApproval 
        ? 'Adjustment submitted for approval' 
        : 'Adjustment applied successfully'
      )
      handleClose()
    } catch (error) {
      toast.error('Failed to submit adjustment')
      console.error('Adjustment submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="text-primary" />
            Time & Rate Adjustment Wizard
          </DialogTitle>
          <DialogDescription>
            Adjust timesheet hours and rates with full audit trail
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Stepper steps={steps} />

          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Worker</div>
                <div className="font-medium">{timesheet.workerName}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Client</div>
                <div className="font-medium">{timesheet.clientName}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Original Hours</div>
                <div className="font-medium">{timesheet.hoursWorked}h</div>
              </div>
              <div>
                <div className="text-muted-foreground">Original Rate</div>
                <div className="font-medium">£{timesheet.rate.toFixed(2)}/h</div>
              </div>
            </div>
          </Card>

          {currentStep === 0 && (
            <div className="space-y-4">
              <Label>What would you like to adjust?</Label>
              <div className="grid gap-3">
                <Card 
                  className={`p-4 cursor-pointer transition-all hover:border-primary ${
                    adjustmentType === 'time' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setAdjustmentType('time')}
                >
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 text-primary" size={20} />
                    <div className="flex-1">
                      <div className="font-medium">Time Only</div>
                      <div className="text-sm text-muted-foreground">
                        Adjust the number of hours worked
                      </div>
                    </div>
                  </div>
                </Card>

                <Card 
                  className={`p-4 cursor-pointer transition-all hover:border-primary ${
                    adjustmentType === 'rate' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setAdjustmentType('rate')}
                >
                  <div className="flex items-start gap-3">
                    <CurrencyDollar className="mt-0.5 text-primary" size={20} />
                    <div className="flex-1">
                      <div className="font-medium">Rate Only</div>
                      <div className="text-sm text-muted-foreground">
                        Adjust the hourly rate
                      </div>
                    </div>
                  </div>
                </Card>

                <Card 
                  className={`p-4 cursor-pointer transition-all hover:border-primary ${
                    adjustmentType === 'both' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setAdjustmentType('both')}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 text-primary" size={20} />
                    <div className="flex-1">
                      <div className="font-medium">Time & Rate</div>
                      <div className="text-sm text-muted-foreground">
                        Adjust both hours and rate
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {(adjustmentType === 'time' || adjustmentType === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="adjusted-hours">Adjusted Hours</Label>
                  <Input
                    id="adjusted-hours"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder={timesheet.hoursWorked.toString()}
                    value={adjustedHours}
                    onChange={(e) => setAdjustedHours(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Original: {timesheet.hoursWorked}h
                    {adjustedHours && (
                      <span className={parseFloat(adjustedHours) > timesheet.hoursWorked ? 'text-success' : 'text-warning'}>
                        {' '}→ {adjustedHours}h ({parseFloat(adjustedHours) > timesheet.hoursWorked ? '+' : ''}{(parseFloat(adjustedHours) - timesheet.hoursWorked).toFixed(2)}h)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(adjustmentType === 'rate' || adjustmentType === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="adjusted-rate">Adjusted Rate (£/hour)</Label>
                  <Input
                    id="adjusted-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={timesheet.rate.toString()}
                    value={adjustedRate}
                    onChange={(e) => setAdjustedRate(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground">
                    Original: £{timesheet.rate.toFixed(2)}/h
                    {adjustedRate && (
                      <span className={parseFloat(adjustedRate) > timesheet.rate ? 'text-success' : 'text-warning'}>
                        {' '}→ £{parseFloat(adjustedRate).toFixed(2)}/h ({parseFloat(adjustedRate) > timesheet.rate ? '+' : ''}£{(parseFloat(adjustedRate) - timesheet.rate).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(adjustedHours || adjustedRate) && (
                <Alert>
                  <Info />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-medium">Impact Summary</div>
                      <div className="text-sm">
                        Original Total: £{originalTotal.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        New Total: £{newTotal.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${difference >= 0 ? 'text-success' : 'text-destructive'}`}>
                        Difference: {difference >= 0 ? '+' : ''}£{difference.toFixed(2)} ({difference >= 0 ? '+' : ''}{percentageChange}%)
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adjustment-reason">Reason for Adjustment *</Label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger id="adjustment-reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADJUSTMENT_REASONS.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustment-notes">Additional Notes</Label>
                <Textarea
                  id="adjustment-notes"
                  placeholder="Provide additional context for this adjustment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <div className="text-xs text-muted-foreground">
                  {adjustmentReason === 'other' && 'Required when selecting "Other"'}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Alert className={requiresApproval ? 'border-warning' : 'border-success'}>
                {requiresApproval ? <WarningCircle className="text-warning" /> : <CheckCircle className="text-success" />}
                <AlertDescription>
                  <div className="font-medium">
                    {requiresApproval 
                      ? 'Approval Required' 
                      : 'No Approval Required'}
                  </div>
                  <div className="text-sm mt-1">
                    {requiresApproval 
                      ? 'This adjustment exceeds threshold limits and will require manager approval before being applied.'
                      : 'This adjustment is within acceptable limits and will be applied immediately.'}
                  </div>
                </AlertDescription>
              </Alert>

              <Card className="p-4 space-y-3">
                <div className="font-medium">Adjustment Summary</div>
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Adjustment Type</div>
                    <div className="font-medium capitalize">
                      {adjustmentType === 'both' ? 'Time & Rate' : adjustmentType}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reason</div>
                    <div className="font-medium">
                      {ADJUSTMENT_REASONS.find(r => r.value === adjustmentReason)?.label}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {(adjustmentType === 'time' || adjustmentType === 'both') && (
                    <div className="flex justify-between">
                      <span>Hours:</span>
                      <span className="font-medium">
                        {timesheet.hoursWorked}h → {newHours}h
                        <Badge variant="outline" className="ml-2">
                          {newHours > timesheet.hoursWorked ? '+' : ''}{(newHours - timesheet.hoursWorked).toFixed(2)}h
                        </Badge>
                      </span>
                    </div>
                  )}
                  {(adjustmentType === 'rate' || adjustmentType === 'both') && (
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-medium">
                        £{timesheet.rate.toFixed(2)}/h → £{newRate.toFixed(2)}/h
                        <Badge variant="outline" className="ml-2">
                          {newRate > timesheet.rate ? '+' : ''}£{(newRate - timesheet.rate).toFixed(2)}
                        </Badge>
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-sm font-medium">
                  <span>Total Impact:</span>
                  <span className={difference >= 0 ? 'text-success' : 'text-destructive'}>
                    £{originalTotal.toFixed(2)} → £{newTotal.toFixed(2)}
                    <Badge variant={difference >= 0 ? 'default' : 'destructive'} className="ml-2">
                      {difference >= 0 ? '+' : ''}£{difference.toFixed(2)}
                    </Badge>
                  </span>
                </div>

                {notes && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs">Notes:</div>
                      <div className="text-sm">{notes}</div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2" size={16} />
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : requiresApproval ? 'Submit for Approval' : 'Apply Adjustment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
