import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import { WizardProgressBar } from '@/components/timesheet-adjustment/WizardProgressBar'
import { ReviewStep } from '@/components/timesheet-adjustment/ReviewStep'
import { AdjustStep } from '@/components/timesheet-adjustment/AdjustStep'
import { ReasonStep } from '@/components/timesheet-adjustment/ReasonStep'
import { ConfirmStep } from '@/components/timesheet-adjustment/ConfirmStep'
import { useTimesheetAdjustmentWizard } from '@/hooks/useTimesheetAdjustmentWizard'
import type { Timesheet, TimesheetAdjustment } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdjust: (timesheetId: string, adjustment: Partial<TimesheetAdjustment>) => void
}

export function TimesheetAdjustmentWizard({ timesheet, open, onOpenChange, onAdjust }: Props) {
  const vm = useTimesheetAdjustmentWizard(timesheet, onAdjust, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClockCounterClockwise size={24} />
            Timesheet Adjustment Wizard
          </DialogTitle>
          <DialogDescription>Adjust hours and rates with automatic credit/invoice generation</DialogDescription>
        </DialogHeader>

        <WizardProgressBar currentStep={vm.currentStep} />

        <div className="space-y-6">
          {vm.currentStep === 'review' && <ReviewStep timesheet={timesheet} />}
          {vm.currentStep === 'adjust' && (
            <AdjustStep
              timesheet={timesheet}
              newHours={vm.newHours} setNewHours={vm.setNewHours}
              newRate={vm.newRate} setNewRate={vm.setNewRate}
              isValid={vm.isValid()}
              originalAmount={vm.originalAmount} newAmount={vm.newAmount}
              difference={vm.difference} percentageChange={vm.percentageChange}
            />
          )}
          {vm.currentStep === 'reason' && <ReasonStep reason={vm.reason} setReason={vm.setReason} />}
          {vm.currentStep === 'confirm' && (
            <ConfirmStep
              timesheet={timesheet}
              newHours={vm.newHours} newRate={vm.newRate}
              reason={vm.reason}
              originalAmount={vm.originalAmount} newAmount={vm.newAmount}
              difference={vm.difference} issueCredit={vm.issueCredit}
            />
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={vm.currentStep === 'review' ? () => onOpenChange(false) : vm.handleBack}>
            {vm.currentStep === 'review' ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={vm.currentStep === 'confirm' ? vm.handleSubmit : vm.handleNext}
            disabled={(vm.currentStep === 'adjust' && !vm.isValid()) || (vm.currentStep === 'reason' && !vm.reason.trim())}
          >
            {vm.currentStep === 'confirm' ? (
              <><CheckCircle size={18} className="mr-2" />Confirm Adjustment</>
            ) : (
              <>Next<ArrowRight size={18} className="ml-2" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
