import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/ui/stack'
import { Calendar, Clock, Play, Pause, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import { formatDistance } from 'date-fns'
import { REPORT_TYPE_LABELS, FREQUENCY_LABELS } from '@/hooks/useScheduledReportsManager'
import type { ScheduledReport } from '@/hooks/use-scheduled-reports'

interface Props {
  schedule: ScheduledReport
  onRunNow: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (id: string) => void
  onShowHistory: (s: ScheduledReport) => void
}

export function ScheduledReportCard({ schedule, onRunNow, onPause, onResume, onDelete, onShowHistory }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{schedule.name}</CardTitle>
              <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>{schedule.status}</Badge>
            </div>
            {schedule.description && <CardDescription className="text-sm">{schedule.description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Stack spacing={4}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Type', value: REPORT_TYPE_LABELS[schedule.type] },
              { label: 'Frequency', value: FREQUENCY_LABELS[schedule.frequency] },
              { label: 'Format', value: schedule.format.toUpperCase() },
              { label: 'Run Count', value: String(schedule.runCount) },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-muted-foreground mb-1">{label}</div>
                <div className="font-medium">{value}</div>
              </div>
            ))}
          </div>

          {schedule.lastRunDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>Last run: {formatDistance(new Date(schedule.lastRunDate), new Date(), { addSuffix: true })}</span>
              {schedule.lastRunStatus === 'success' ? <CheckCircle size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>Next run: {formatDistance(new Date(schedule.nextRunDate), new Date(), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button size="sm" variant="outline" onClick={() => onRunNow(schedule.id)}><Play size={16} className="mr-1.5" />Run Now</Button>
            {schedule.status === 'active' ? (
              <Button size="sm" variant="outline" onClick={() => onPause(schedule.id)}><Pause size={16} className="mr-1.5" />Pause</Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => onResume(schedule.id)}><Play size={16} className="mr-1.5" />Resume</Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onShowHistory(schedule)}><Clock size={16} className="mr-1.5" />History</Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(schedule.id)}><Trash size={16} className="mr-1.5" />Delete</Button>
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}
