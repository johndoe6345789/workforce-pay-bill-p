import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Warning, Envelope } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { getSeverity, SEVERITY_CONFIG } from '@/hooks/useMissingTimesheetsReport'
import type { MissingTimesheetReport } from '@/lib/types'

interface Props {
  report: MissingTimesheetReport
  onSendReminder: (workerId: string, workerName: string) => void
}

export function MissingTimesheetRow({ report, onSendReminder }: Props) {
  const severity = getSeverity(report.daysOverdue)
  const { label, badgeVariant, colorClass } = SEVERITY_CONFIG[severity]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Warning size={24} weight="fill" className={colorClass} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{report.workerName}</h3>
                <Badge variant={badgeVariant as any}>{report.daysOverdue} days overdue</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-muted-foreground">Client</p><p className="font-medium">{report.clientName}</p></div>
                <div><p className="text-muted-foreground">Expected Week Ending</p><p className="font-medium">{new Date(report.expectedWeekEnding).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">Last Submission</p><p className="font-medium">{report.lastSubmissionDate ? new Date(report.lastSubmissionDate).toLocaleDateString() : 'Never'}</p></div>
                <div><p className="text-muted-foreground">Status</p><p className={cn('font-semibold', colorClass)}>{label}</p></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" onClick={() => onSendReminder(report.workerId, report.workerName)}>
              <Envelope size={16} className="mr-2" />Send Reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
