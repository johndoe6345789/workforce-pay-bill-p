import { Badge } from '@/components/ui/badge'
import { ClockCounterClockwise } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  t: (key: string, params?: Record<string, unknown>) => string
}

export function HistoryTab({ timesheet, t }: Props) {
  if (!timesheet.approvalHistory || timesheet.approvalHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ClockCounterClockwise size={32} className="mx-auto mb-2 opacity-50" />
        <p>{t('timesheetDetailDialog.noApprovalHistory')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {timesheet.approvalHistory.map((entry, idx) => (
        <div key={idx} className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={entry.status === 'approved' ? 'success' : entry.status === 'rejected' ? 'destructive' : 'outline'}>
                {entry.status}
              </Badge>
              <span className="font-medium capitalize">{entry.step} Approval</span>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">{t('timesheetDetailDialog.approverName')}: <span className="text-foreground">{entry.approverName}</span></p>
            <p className="text-muted-foreground">{t('timesheetDetailDialog.approverEmail')}: <span className="text-foreground font-mono text-xs">{entry.approverEmail}</span></p>
            {entry.notes && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-muted-foreground">{t('timesheetDetailDialog.approvalNotes')}:</p>
                <p className="text-foreground">{entry.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
