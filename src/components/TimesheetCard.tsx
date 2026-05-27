import { useState } from 'react'
import { ClockCounterClockwise, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Timesheet } from '@/lib/types'
import { TimesheetShiftsPanel } from '@/components/timesheet-card/TimesheetShiftsPanel'
import { TimesheetCardActions } from '@/components/timesheet-card/TimesheetCardActions'
import type React from 'react'

const STATUS_CONFIG: Record<string, { Icon: React.ElementType; color: string }> = {
  pending:    { Icon: ClockCounterClockwise, color: 'text-warning' },
  approved:   { Icon: CheckCircle,          color: 'text-success' },
  rejected:   { Icon: XCircle,              color: 'text-destructive' },
  processing: { Icon: Clock,               color: 'text-info' },
}

interface Props {
  timesheet: Timesheet
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust?: (ts: Timesheet) => void
  onViewDetails?: (ts: Timesheet) => void
  onDelete?: (id: string) => void
}

export function TimesheetCard({ timesheet, onApprove, onReject, onCreateInvoice, onAdjust, onViewDetails, onDelete }: Props) {
  const [showShifts, setShowShifts] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { Icon, color } = STATUS_CONFIG[timesheet.status] ?? STATUS_CONFIG.pending
  const hasShifts = (timesheet.shifts?.length ?? 0) > 0

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails?.(timesheet)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <Icon size={24} weight="fill" className={color} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{timesheet.workerName}</h3>
                  <Badge variant={timesheet.status === 'approved' ? 'success' : timesheet.status === 'rejected' ? 'destructive' : 'warning'}>{timesheet.status}</Badge>
                  {hasShifts && <Badge variant="outline" className="text-xs">{timesheet.shifts!.length} shifts</Badge>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Client</p><p className="font-medium">{timesheet.clientName}</p></div>
                  <div><p className="text-muted-foreground">Week Ending</p><p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Hours</p><p className="font-medium font-mono">{timesheet.hours.toFixed(2)}</p></div>
                  <div><p className="text-muted-foreground">Amount</p><p className="font-medium font-mono">£{timesheet.amount.toFixed(2)}</p></div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(timesheet.submittedDate).toLocaleDateString()}
                  {timesheet.approvedDate && ` • Approved ${new Date(timesheet.approvedDate).toLocaleDateString()}`}
                </div>
                {hasShifts && (
                  <TimesheetShiftsPanel shifts={timesheet.shifts!} showShifts={showShifts} onToggle={e => { e.stopPropagation(); setShowShifts(!showShifts) }} />
                )}
              </div>
            </div>
          </div>
          <TimesheetCardActions timesheet={timesheet} showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} onApprove={onApprove} onReject={onReject} onCreateInvoice={onCreateInvoice} onAdjust={onAdjust} onDelete={onDelete} />
        </div>
      </CardContent>
    </Card>
  )
}
