import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/ui/stack'
import { CheckCircle, XCircle, Download } from '@phosphor-icons/react'
import type { ScheduledReport, ReportExecution } from '@/hooks/use-scheduled-reports'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ScheduledReport | null
  history: ReportExecution[]
}

export function ScheduledReportHistoryDialog({ open, onOpenChange, schedule, history }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Execution History</DialogTitle>
          <DialogDescription>{schedule?.name}</DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <Stack spacing={2}>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No execution history yet</p>
            ) : (
              history.map(execution => (
                <div key={execution.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {execution.status === 'success'
                        ? <CheckCircle size={20} className="text-success" />
                        : <XCircle size={20} className="text-destructive" />}
                      <span className="font-medium">{new Date(execution.executedAt).toLocaleString()}</span>
                      <Badge variant="outline" className="uppercase">{execution.format}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {execution.recordCount} records{execution.error && ` • Error: ${execution.error}`}
                    </div>
                  </div>
                  {execution.status === 'success' && <Download size={20} className="text-muted-foreground" />}
                </div>
              ))
            )}
          </Stack>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
