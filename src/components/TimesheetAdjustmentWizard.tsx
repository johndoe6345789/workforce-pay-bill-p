import { useState } from 'react'
import { PencilSimple, Clock, CurrencyDollar, FileText, ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { Timesheet, TimesheetAdjustment } from '@/lib/types'

interface TimesheetAdjustmentWizardProps {
  isOpen: boolean
  onClose: () => void
  timesheet: Timesheet
  onAdjust: (timesheetId: string, adjustment: Omit<TimesheetAdjustment, 'id' | 'adjustmentDate'>) => void
}

export function TimesheetAdjustmentWizard({ 
  isOpen, 
  onClose, 
  timesheet, 
  onAdjust 
}: TimesheetAdjustmentWizardProps) {
  const [step, setStep] = useState(1)
  const [newHours, setNewHours] = useState(timesheet.hours.toString())
  const [newRate, setNewRate] = useState(timesheet.rate?.toString() || '')
  const [reason, setReason] = useState('')
  const [adjustedBy, setAdjustedBy] = useState('Admin User')

  const oldAmount = timesheet.amount
  const calculatedNewAmount = parseFloat(newHours || '0') * parseFloat(newRate || '0')
  const amountDifference = calculatedNewAmount - oldAmount

  const handleNext = () => {
    if (step === 1) {
      if (!newHours || parseFloat(newHours) <= 0) {
        toast.error('Please enter valid hours')
        return
      }
      if (!newRate || parseFloat(newRate) <= 0) {
        toast.error('Please enter valid rate')
        return
      }
      if (parseFloat(newHours) === timesheet.hours && parseFloat(newRate) === (timesheet.rate || 0)) {
        toast.error('No changes detected')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!reason.trim()) {
        toast.error('Please provide a reason for adjustment')
        return
      }
      setStep(3)
    }
  }

  const handleConfirm = () => {
    const adjustment: Omit<TimesheetAdjustment, 'id' | 'adjustmentDate'> = {
      adjustedBy,
      previousHours: timesheet.hours,
      newHours: parseFloat(newHours),
      previousRate: timesheet.rate,
      newRate: parseFloat(newRate),
      reason
    }

    onAdjust(timesheet.id, adjustment)
    toast.success('Timesheet adjusted successfully')
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setNewHours(timesheet.hours.toString())
    setNewRate(timesheet.rate?.toString() || '')
    setReason('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Timesheet Adjustment Wizard</DialogTitle>
          <DialogDescription>
            Adjust hours and rates for {timesheet.workerName} - Week ending {new Date(timesheet.weekEnding).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className={`text-sm ${step >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>Adjust Values</span>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className={`text-sm ${step >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>Provide Reason</span>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className={`text-sm ${step >= 3 ? 'font-medium' : 'text-muted-foreground'}`}>Review & Confirm</span>
            </div>
          </div>

          <Separator />

          {step === 1 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Current Values</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-mono font-medium">{timesheet.hours}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-mono font-medium">£{timesheet.rate?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-mono font-medium">£{oldAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-hours">
                    <Clock size={16} className="inline mr-2" />
                    New Hours
                  </Label>
                  <Input
                    id="new-hours"
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    placeholder="40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-rate">
                    <CurrencyDollar size={16} className="inline mr-2" />
                    New Rate (£/hr)
                  </Label>
                  <Input
                    id="new-rate"
                    type="number"
                    step="0.01"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="25.00"
                  />
                </div>
              </div>

              <Card className="bg-accent/10">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Calculated Changes</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">New Amount</p>
                      <p className="font-mono font-semibold text-lg">£{calculatedNewAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Difference</p>
                      <p className={`font-mono font-semibold text-lg ${amountDifference >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {amountDifference >= 0 ? '+' : ''}£{amountDifference.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">
                  <FileText size={16} className="inline mr-2" />
                  Adjustment Reason
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this adjustment is necessary..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  This will be recorded in the audit trail and may be visible to the client
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjusted-by">Adjusted By</Label>
                <Input
                  id="adjusted-by"
                  value={adjustedBy}
                  onChange={(e) => setAdjustedBy(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-success" weight="fill" />
                    <h4 className="font-medium">Review Adjustment</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Worker</p>
                      <p className="font-medium">{timesheet.workerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{timesheet.clientName}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Hours</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono line-through text-muted-foreground">{timesheet.hours}</span>
                          <ArrowRight size={14} />
                          <span className="font-mono font-medium">{newHours}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rate</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono line-through text-muted-foreground">£{timesheet.rate?.toFixed(2)}</span>
                          <ArrowRight size={14} />
                          <span className="font-mono font-medium">£{parseFloat(newRate).toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono line-through text-muted-foreground">£{oldAmount.toFixed(2)}</span>
                          <ArrowRight size={14} />
                          <span className="font-mono font-medium">£{calculatedNewAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-muted-foreground text-sm">Reason</p>
                    <p className="text-sm mt-1">{reason}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm">Adjusted By</p>
                    <p className="text-sm mt-1">{adjustedBy}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-warning/10 border-warning/20">
                <CardContent className="p-4">
                  <p className="text-sm">
                    <strong>Important:</strong> This adjustment will update the timesheet and may trigger invoice recalculation. 
                    The change will be logged in the audit trail.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button className="ml-auto" onClick={handleNext}>
              Next
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button className="ml-auto" onClick={handleConfirm}>
              <CheckCircle size={16} className="mr-2" />
              Confirm Adjustment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
