import { CheckCircle, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { PayrollPreviewData } from '@/hooks/useOneClickPayroll'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  preview: PayrollPreviewData | null
  isProcessing: boolean
  onConfirm: () => void
}

export function PayrollPreviewDialog({ open, onOpenChange, preview, isProcessing, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Payroll Processing</DialogTitle>
          <DialogDescription>Review payment details before processing</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Workers', value: preview?.totalWorkers },
              { label: 'Timesheets', value: preview?.totalTimesheets },
              { label: 'Total', value: `£${preview?.totalAmount.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold font-mono">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="max-h-96 overflow-y-auto space-y-2">
            {preview?.workers.map((worker) => (
              <div key={worker.workerId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{worker.workerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {worker.hours} hours • {worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-semibold font-mono text-lg">£{worker.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center gap-2 p-4 bg-warning/10 rounded-lg">
            <Warning size={20} className="text-warning" />
            <p className="text-sm">
              This action will generate payment files and mark timesheets as processed. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : <><CheckCircle size={18} className="mr-2" />Confirm & Process</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
