import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Stack } from '@/components/ui/stack'
import { DataList } from '@/components/ui/data-list'
import { ArrowRight, Clock } from '@phosphor-icons/react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBatch: any
  isProcessing: boolean
  progress: number
  onProcess: () => void
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-warning/10 text-warning-foreground border-warning/30',
  processing: 'bg-accent/10 text-accent-foreground border-accent/30',
  approved: 'bg-success/10 text-success-foreground border-success/30',
  rejected: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
  completed: 'bg-success/10 text-success-foreground border-success/30',
}

export function BatchPreviewDialog({ open, onOpenChange, currentBatch, isProcessing, progress, onProcess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Payroll Batch</DialogTitle>
          <DialogDescription>Review the payroll batch before submitting for approval</DialogDescription>
        </DialogHeader>
        {currentBatch && (
          <Stack spacing={4}>
            <Card>
              <CardHeader><CardTitle className="text-base">Batch Summary</CardTitle></CardHeader>
              <CardContent>
                <DataList items={[
                  { label: 'Batch ID', value: currentBatch.id },
                  { label: 'Period', value: `${currentBatch.periodStart} to ${currentBatch.periodEnd}` },
                  { label: 'Workers', value: currentBatch.workers.length },
                  { label: 'Total Amount', value: `£${currentBatch.totalAmount.toLocaleString()}` },
                  { label: 'Status', value: <Badge className={STATUS_STYLES[currentBatch.status]}>{currentBatch.status}</Badge> }
                ]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Worker Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentBatch.workers.map((worker: any) => (
                    <div key={worker.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{worker.name}</div>
                        <div className="text-sm text-muted-foreground">{worker.timesheetCount} timesheet{worker.timesheetCount !== 1 ? 's' : ''} • {worker.totalHours.toFixed(1)} hours</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">£{worker.grossPay.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Net: £{worker.netPay.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {isProcessing && (
              <Card>
                <CardContent className="pt-6">
                  <Stack spacing={2}>
                    <div className="flex items-center justify-between text-sm"><span>Processing batch...</span><span>{Math.round(progress)}%</span></div>
                    <Progress value={progress} />
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={onProcess} disabled={isProcessing}>
            {isProcessing ? <><Clock className="mr-2 animate-spin" />Processing...</> : <><ArrowRight className="mr-2" />Submit for Approval</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
