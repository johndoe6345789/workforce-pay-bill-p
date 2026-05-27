import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Stepper } from '@/components/ui/stepper'
import { ArrowLeft, ArrowRight, Clock } from '@phosphor-icons/react'
import { TypeSelectionStep } from '@/components/time-adjustment/TypeSelectionStep'
import { ValuesStep } from '@/components/time-adjustment/ValuesStep'
import { JustificationStep } from '@/components/time-adjustment/JustificationStep'
import { ReviewStep } from '@/components/time-adjustment/ReviewStep'
import { useTimeAdjustmentWizard } from '@/hooks/useTimeAdjustmentWizard'

export interface TimeAndRateAdjustment {
  timesheetId: string; workerId: string; workerName: string; clientName: string
  originalHours: number; originalRate: number; adjustedHours?: number; adjustedRate?: number
  adjustmentReason: string; adjustmentType: 'time' | 'rate' | 'both'
  approvalRequired: boolean; notes?: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  timesheet: { id: string; workerId: string; workerName: string; clientName: string; hoursWorked: number; rate: number; status: string } | null
  onSubmit: (adjustment: TimeAndRateAdjustment) => Promise<void>
}

export function TimeAndRateAdjustmentWizard({ open, onOpenChange, timesheet, onSubmit }: Props) {
  const vm = useTimeAdjustmentWizard(timesheet, onSubmit, () => onOpenChange(false))

  if (!timesheet) return null

  return (
    <Dialog open={open} onOpenChange={vm.handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="text-primary" />Time & Rate Adjustment Wizard
          </DialogTitle>
          <DialogDescription>Adjust timesheet hours and rates with full audit trail</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Stepper steps={vm.steps} />

          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Worker', value: timesheet.workerName },
                { label: 'Client', value: timesheet.clientName },
                { label: 'Original Hours', value: `${timesheet.hoursWorked}h` },
                { label: 'Original Rate', value: `£${timesheet.rate.toFixed(2)}/h` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-muted-foreground">{label}</div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
          </Card>

          {vm.currentStep === 0 && <TypeSelectionStep value={vm.adjustmentType} onChange={vm.setAdjustmentType} />}
          {vm.currentStep === 1 && <ValuesStep timesheet={timesheet} adjustmentType={vm.adjustmentType} adjustedHours={vm.adjustedHours} setAdjustedHours={vm.setAdjustedHours} adjustedRate={vm.adjustedRate} setAdjustedRate={vm.setAdjustedRate} calculations={vm.calculations} />}
          {vm.currentStep === 2 && <JustificationStep adjustmentReason={vm.adjustmentReason} setAdjustmentReason={vm.setAdjustmentReason} notes={vm.notes} setNotes={vm.setNotes} />}
          {vm.currentStep === 3 && <ReviewStep timesheet={timesheet} adjustmentType={vm.adjustmentType} adjustmentReason={vm.adjustmentReason} notes={vm.notes} calculations={vm.calculations} />}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={vm.handleClose} disabled={vm.isSubmitting}>Cancel</Button>
          {vm.currentStep > 0 && <Button variant="outline" onClick={vm.handlePrevious} disabled={vm.isSubmitting}><ArrowLeft className="mr-2" size={16} />Previous</Button>}
          {vm.currentStep < vm.steps.length - 1 ? (
            <Button onClick={vm.handleNext}>Next<ArrowRight className="ml-2" size={16} /></Button>
          ) : (
            <Button onClick={vm.handleSubmit} disabled={vm.isSubmitting}>
              {vm.isSubmitting ? 'Submitting...' : vm.calculations.requiresApproval ? 'Submit for Approval' : 'Apply Adjustment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
