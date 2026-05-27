import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Building, CalendarBlank, Clock, CurrencyDollar } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  t: (key: string, params?: Record<string, unknown>) => string
}

export function OverviewTab({ timesheet, t }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><User size={16} /><span>{t('timesheetDetailDialog.worker')}</span></div>
          <p className="font-medium">{timesheet.workerName}</p>
          <p className="text-xs text-muted-foreground">ID: {timesheet.workerId}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Building size={16} /><span>{t('timesheetDetailDialog.client')}</span></div>
          <p className="font-medium">{timesheet.clientName}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CalendarBlank size={16} /><span>{t('timesheetDetailDialog.weekEnding')}</span></div>
          <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock size={16} /><span>{t('timesheetDetailDialog.totalHours')}</span></div>
          <p className="font-medium font-mono text-lg">{timesheet.hours.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CurrencyDollar size={16} /><span>{t('timesheetDetailDialog.amount')}</span></div>
          <p className="font-semibold font-mono text-lg">£{timesheet.amount.toFixed(2)}</p>
        </div>
        {timesheet.rate && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><CurrencyDollar size={16} /><span>{t('timesheetDetailDialog.hourlyRate')}</span></div>
            <p className="font-medium font-mono">£{timesheet.rate.toFixed(2)}/hr</p>
          </div>
        )}
      </div>

      <Separator />
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{t('timesheetDetailDialog.submissionDetails')}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">{t('timesheetDetailDialog.submittedDate')}</p><p className="font-medium">{new Date(timesheet.submittedDate).toLocaleString()}</p></div>
          {timesheet.submissionMethod && <div><p className="text-muted-foreground">{t('timesheetDetailDialog.submissionMethod')}</p><Badge variant="outline">{timesheet.submissionMethod}</Badge></div>}
          {timesheet.approvedDate && <div><p className="text-muted-foreground">{t('timesheetDetailDialog.approvedDate')}</p><p className="font-medium">{new Date(timesheet.approvedDate).toLocaleString()}</p></div>}
          {timesheet.currentApprovalStep && <div><p className="text-muted-foreground">{t('timesheetDetailDialog.currentStep')}</p><Badge variant="outline">{timesheet.currentApprovalStep}</Badge></div>}
        </div>
      </div>

      {timesheet.adjustments && timesheet.adjustments.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t('timesheetDetailDialog.adjustments')}</h4>
            <div className="space-y-2">
              {timesheet.adjustments.map(adj => (
                <div key={adj.id} className="bg-muted/30 rounded p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{adj.id}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(adj.adjustmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-muted-foreground">{t('timesheetDetailDialog.hours')}</p><p className="font-mono">{adj.previousHours} → {adj.newHours}</p></div>
                    {adj.previousRate && adj.newRate && <div><p className="text-muted-foreground">{t('timesheetDetailDialog.rate')}</p><p className="font-mono">£{adj.previousRate} → £{adj.newRate}</p></div>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{adj.reason}</p>
                  <p className="text-xs text-muted-foreground">{t('timesheetDetailDialog.adjustedBy')}: {adj.adjustedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {timesheet.validationErrors && timesheet.validationErrors.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-destructive">{t('timesheetDetailDialog.validationErrors')}</h4>
            <div className="space-y-1">
              {timesheet.validationErrors.map((error, idx) => (
                <div key={idx} className="bg-destructive/10 text-destructive rounded p-2 text-sm">{error}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
