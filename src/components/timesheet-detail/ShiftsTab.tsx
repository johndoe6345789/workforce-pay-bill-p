import { Badge } from '@/components/ui/badge'
import { Clock } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'

const SHIFT_BADGE_COLOR: Record<string, string> = {
  night: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  evening: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  weekend: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  holiday: 'bg-red-500/10 text-red-500 border-red-500/20',
  overtime: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'early-morning': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

const SHIFT_DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }

interface Props {
  timesheet: Timesheet
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ShiftsTab({ timesheet, t }: Props) {
  if (!timesheet.shifts || timesheet.shifts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p>{t('timesheetDetailDialog.noShiftDetails')}</p>
        <p className="text-sm">{t('timesheetDetailDialog.simpleHourEntry')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {timesheet.shifts.map(shift => (
        <div key={shift.id} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={SHIFT_BADGE_COLOR[shift.shiftType] ?? 'bg-muted text-muted-foreground border-border'}>
                {t(`timesheetDetailDialog.shiftTypes.${shift.shiftType}`) || shift.shiftType}
              </Badge>
              <span className="font-medium">{new Date(shift.date).toLocaleDateString('en-GB', SHIFT_DATE_FORMAT)}</span>
            </div>
            {shift.rateMultiplier > 1.0 && (
              <Badge variant="outline" className="font-mono">{t('timesheetDetailDialog.rateMultiplier', { multiplier: shift.rateMultiplier })}</Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.startTime')}</p><p className="font-mono font-medium">{shift.startTime}</p></div>
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.endTime')}</p><p className="font-mono font-medium">{shift.endTime}</p></div>
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.breakMinutes')}</p><p className="font-mono font-medium">{shift.breakMinutes}</p></div>
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.hours')}</p><p className="font-mono font-medium">{shift.hours.toFixed(2)}</p></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t border-border">
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.rate')}</p><p className="font-mono font-medium">£{shift.rate.toFixed(2)}/hr</p></div>
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.dayOfWeek')}</p><p className="font-medium capitalize">{shift.dayOfWeek}</p></div>
            <div><p className="text-muted-foreground">{t('timesheetDetailDialog.amount')}</p><p className="font-mono font-semibold text-base">£{shift.amount.toFixed(2)}</p></div>
          </div>
          {shift.notes && (
            <div className="pt-2 border-t border-border">
              <p className="text-muted-foreground text-sm">{t('timesheetDetailDialog.notes')}</p>
              <p className="text-sm">{shift.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
