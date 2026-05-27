import { CheckCircle, Users } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Grid } from '@/components/ui/grid'
import { BatchPreviewDialog } from '@/components/payroll-batch/BatchPreviewDialog'
import { ValidationResultsDialog } from '@/components/payroll-batch/ValidationResultsDialog'
import { usePayrollBatchProcessor } from '@/hooks/usePayrollBatchProcessor'

interface Props {
  timesheets: any[]
  workers: any[]
  onBatchComplete?: (batch: any) => void
}

export function PayrollBatchProcessor({ timesheets, workers, onBatchComplete }: Props) {
  const vm = usePayrollBatchProcessor(timesheets, workers, onBatchComplete)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payroll Batch Processing</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={vm.handleSelectAll}>
                {vm.selectedWorkers.length === vm.workersWithTimesheets.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button onClick={vm.handleValidate} disabled={!vm.selectedWorkers.length}>
                <CheckCircle className="mr-2" />Validate & Process ({vm.selectedWorkers.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {vm.selectedWorkers.length > 0 && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <Grid cols={4} gap={4}>
                <div><div className="text-sm text-muted-foreground">Workers</div><div className="text-2xl font-semibold">{vm.batchTotals.workers}</div></div>
                <div><div className="text-sm text-muted-foreground">Timesheets</div><div className="text-2xl font-semibold">{vm.batchTotals.timesheets}</div></div>
                <div><div className="text-sm text-muted-foreground">Total Hours</div><div className="text-2xl font-semibold">{vm.batchTotals.hours.toFixed(1)}</div></div>
                <div><div className="text-sm text-muted-foreground">Total Amount</div><div className="text-2xl font-semibold">£{vm.batchTotals.amount.toLocaleString()}</div></div>
              </Grid>
            </div>
          )}
          <div className="space-y-2">
            {!vm.workersWithTimesheets.length ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto mb-4" size={48} />
                <p>No workers with approved timesheets available for processing</p>
              </div>
            ) : vm.workersWithTimesheets.map((worker) => (
              <Card key={worker.id} className="overflow-hidden">
                <div className="p-4 flex items-start gap-4">
                  <Checkbox checked={vm.selectedWorkers.includes(worker.id)} onCheckedChange={() => vm.handleToggleWorker(worker.id)} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div><div className="font-medium">{worker.name}</div><div className="text-sm text-muted-foreground">{worker.role}</div></div>
                      <div className="text-right"><div className="font-semibold">£{worker.totalAmount.toLocaleString()}</div><div className="text-sm text-muted-foreground">{worker.totalHours.toFixed(1)} hours</div></div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{worker.timesheets.length} timesheet{worker.timesheets.length !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>Payment Method: {worker.paymentMethod || 'PAYE'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <BatchPreviewDialog
        open={vm.showPreview}
        onOpenChange={vm.setShowPreview}
        currentBatch={vm.currentBatch}
        isProcessing={vm.isProcessing}
        progress={vm.progress}
        onProcess={vm.handleProcess}
      />

      <ValidationResultsDialog
        open={vm.showValidation}
        onOpenChange={vm.setShowValidation}
        currentBatch={vm.currentBatch}
      />
    </>
  )
}
