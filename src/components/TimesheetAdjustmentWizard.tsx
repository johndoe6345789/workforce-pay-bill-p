import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowRight, CheckCircle, ClockCounterClockwise, CurrencyDollar, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import type { Timesheet, TimesheetAdjustment } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TimesheetAdjustmentWizardProps {
  timesheet: Timesheet
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdjust: (timesheetId: string, adjustment: Partial<TimesheetAdjustment>) => void
}

type WizardStep = 'review' | 'adjust' | 'reason' | 'confirm'

export function TimesheetAdjustmentWizard({ timesheet, open, onOpenChange, onAdjust }: TimesheetAdjustmentWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('review')
  const [newHours, setNewHours] = useState(timesheet.hours.toString())
  const [newRate, setNewRate] = useState((timesheet.rate || 0).toString())
  const [reason, setReason] = useState('')
  const [issueCredit, setIssueCredit] = useState(true)

  const originalAmount = timesheet.amount
  const newAmount = parseFloat(newHours) * parseFloat(newRate)
  const difference = newAmount - originalAmount
  const percentageChange = originalAmount > 0 ? ((difference / originalAmount) * 100) : 0

  const handleNext = () => {
    const steps: WizardStep[] = ['review', 'adjust', 'reason', 'confirm']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: WizardStep[] = ['review', 'adjust', 'reason', 'confirm']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for the adjustment')
      return
    }

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

  const isValid = () => {
    const hours = parseFloat(newHours)
    const rate = parseFloat(newRate)
    return !isNaN(hours) && hours > 0 && !isNaN(rate) && rate > 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClockCounterClockwise size={24} />
            Timesheet Adjustment Wizard
          </DialogTitle>
          <DialogDescription>
            Adjust hours and rates with automatic credit/invoice generation
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {(['review', 'adjust', 'reason', 'confirm'] as const).map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  currentStep === step ? 'bg-accent text-accent-foreground' :
                  ['review', 'adjust', 'reason', 'confirm'].indexOf(currentStep) > index ? 'bg-success text-success-foreground' :
                  'bg-muted text-muted-foreground'
                )}>
                  {['review', 'adjust', 'reason', 'confirm'].indexOf(currentStep) > index ? (
                    <CheckCircle size={16} weight="fill" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  'text-sm font-medium hidden md:block',
                  currentStep === step ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
              {index < 3 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-2',
                  ['review', 'adjust', 'reason', 'confirm'].indexOf(currentStep) > index ? 'bg-success' : 'bg-border'
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {currentStep === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Original Timesheet</CardTitle>
                <CardDescription>Verify the details before making adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Worker</Label>
                    <p className="font-medium">{timesheet.workerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Client</Label>
                    <p className="font-medium">{timesheet.clientName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Week Ending</Label>
                    <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={timesheet.status === 'approved' ? 'success' : 'warning'}>
                      {timesheet.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">Hours</Label>
                    <p className="font-semibold text-lg font-mono">{timesheet.hours}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Rate</Label>
                    <p className="font-semibold text-lg font-mono">£{(timesheet.rate || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-semibold text-lg font-mono">£{timesheet.amount.toFixed(2)}</p>
                  </div>
                </div>

                {timesheet.adjustments && timesheet.adjustments.length > 0 && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Warning size={18} className="text-warning" />
                      <p className="font-semibold text-sm">Previous Adjustments</p>
                    </div>
                    <div className="space-y-2">
                      {timesheet.adjustments.map((adj) => (
                        <div key={adj.id} className="text-sm text-muted-foreground">
                          {new Date(adj.adjustmentDate).toLocaleDateString()}: {adj.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 'adjust' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adjust Values</CardTitle>
                <CardDescription>Enter new hours and/or rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <Label className="text-muted-foreground text-xs">Original Hours</Label>
                      <p className="font-semibold text-2xl font-mono">{timesheet.hours}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-hours">New Hours</Label>
                      <Input
                        id="new-hours"
                        type="number"
                        step="0.5"
                        value={newHours}
                        onChange={(e) => setNewHours(e.target.value)}
                        className="text-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <Label className="text-muted-foreground text-xs">Original Rate</Label>
                      <p className="font-semibold text-2xl font-mono">£{(timesheet.rate || 0).toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-rate">New Rate (£/hr)</Label>
                      <Input
                        id="new-rate"
                        type="number"
                        step="0.01"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="text-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                {isValid() && (
                  <div className={cn(
                    'p-4 rounded-lg border-l-4',
                    difference > 0 ? 'bg-warning/10 border-warning' :
                    difference < 0 ? 'bg-destructive/10 border-destructive' :
                    'bg-success/10 border-success'
                  )}>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Original Amount</Label>
                        <p className="font-semibold font-mono">£{originalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">New Amount</Label>
                        <p className="font-semibold font-mono">£{newAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Difference</Label>
                        <p className={cn(
                          'font-semibold font-mono',
                          difference > 0 ? 'text-warning' :
                          difference < 0 ? 'text-destructive' :
                          'text-success'
                        )}>
                          {difference >= 0 ? '+' : ''}£{difference.toFixed(2)}
                          <span className="text-xs ml-1">({percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 'reason' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adjustment Reason</CardTitle>
                <CardDescription>Provide a clear explanation for audit trail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Adjustment</Label>
                  <Textarea
                    id="reason"
                    placeholder="E.g., Incorrect hours submitted, overtime not calculated, client requested rate change..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be recorded in the audit trail and visible to auditors
                  </p>
                </div>

                <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Common Reasons:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Incorrect hours submitted',
                      'Overtime not calculated',
                      'Rate change approved',
                      'Client dispute resolution',
                      'Data entry error'
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setReason(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'confirm' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confirm Adjustment</CardTitle>
                <CardDescription>Review and confirm the changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Before</h4>
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hours:</span>
                        <span className="font-mono">{timesheet.hours}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-mono">£{(timesheet.rate || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                        <span>Amount:</span>
                        <span className="font-mono">£{originalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">After</h4>
                    <div className="p-4 bg-accent/10 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hours:</span>
                        <span className="font-mono">{newHours}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-mono">£{parseFloat(newRate).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                        <span>Amount:</span>
                        <span className="font-mono">£{newAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <Label className="text-muted-foreground text-xs">Reason</Label>
                  <p className="text-sm mt-1">{reason}</p>
                </div>

                {difference !== 0 && (
                  <div className={cn(
                    'p-4 rounded-lg',
                    difference > 0 ? 'bg-warning/10' : 'bg-destructive/10'
                  )}>
                    <div className="flex items-start gap-3">
                      <CurrencyDollar size={20} className={difference > 0 ? 'text-warning' : 'text-destructive'} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">
                          {difference > 0 ? 'Additional Invoice Required' : 'Credit Note Required'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {difference > 0 
                            ? `An additional invoice for £${difference.toFixed(2)} will be generated and sent to the client.`
                            : `A credit note for £${Math.abs(difference).toFixed(2)} will be generated ${issueCredit ? 'automatically' : 'for manual review'}.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 'review' ? () => onOpenChange(false) : handleBack}
          >
            {currentStep === 'review' ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={currentStep === 'confirm' ? handleSubmit : handleNext}
            disabled={currentStep === 'adjust' && !isValid() || currentStep === 'reason' && !reason.trim()}
          >
            {currentStep === 'confirm' ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                Confirm Adjustment
              </>
            ) : (
              <>
                Next
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
