import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import type { PayrollRun, Timesheet, Worker } from '@/lib/types'
import { useCreatePayrollDialog } from '@/hooks/useCreatePayrollDialog'
import { PayrollSummaryCard } from '@/components/create-payroll/PayrollSummaryCard'
import { WorkerSelectionList } from '@/components/create-payroll/WorkerSelectionList'

interface CreatePayrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePayroll: (payroll: Omit<PayrollRun, 'id'>) => Promise<void>
  timesheets: Timesheet[]
  workers: Worker[]
}

export function CreatePayrollDialog({ open, onOpenChange, onCreatePayroll, timesheets, workers }: CreatePayrollDialogProps) {
  const vm = useCreatePayrollDialog({ timesheets, workers, onCreatePayroll, onOpenChange })
  const { register, formState: { errors }, setValue } = vm.form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Payroll Run</DialogTitle>
          <DialogDescription>Process payroll for approved timesheets</DialogDescription>
        </DialogHeader>
        <form onSubmit={vm.onSubmit}>
          <Stack>
            <div>
              <Label htmlFor="periodEnding">Period Ending</Label>
              <Input id="periodEnding" type="date" {...register('periodEnding')} />
              {errors.periodEnding && <p className="text-sm text-destructive mt-1">{errors.periodEnding.message}</p>}
            </div>
            <div>
              <Label htmlFor="processingType">Processing Type</Label>
              <Select value={vm.processingType} onValueChange={v => setValue('processingType', v as any)}>
                <SelectTrigger id="processingType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-approved">All Approved Timesheets</SelectItem>
                  <SelectItem value="selected-workers">Selected Workers</SelectItem>
                  <SelectItem value="one-click">One-Click Processing</SelectItem>
                </SelectContent>
              </Select>
              {errors.processingType && <p className="text-sm text-destructive mt-1">{errors.processingType.message}</p>}
            </div>

            <PayrollSummaryCard
              workerCount={vm.workerCount}
              timesheetCount={vm.approvedTimesheets.length}
              totalAmount={vm.payrollAmount}
            />

            {vm.processingType === 'selected-workers' && (
              <WorkerSelectionList
                eligibleWorkers={vm.eligibleWorkers}
                approvedTimesheets={vm.approvedTimesheets}
                selectedWorkers={vm.selectedWorkers}
                onToggle={vm.toggleWorker}
                onSelectAll={vm.selectAll}
                onDeselectAll={vm.deselectAll}
              />
            )}

            {vm.processingType === 'one-click' && (
              <div className="p-4 border border-accent/20 bg-accent/5 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>One-Click Processing:</strong> This will automatically process all approved timesheets
                  for the selected period with no manual review.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={vm.handleCancel} disabled={vm.isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={vm.isSubmitting || vm.workerCount === 0}>
                {vm.isSubmitting ? 'Creating...' : 'Create Payroll Run'}
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
