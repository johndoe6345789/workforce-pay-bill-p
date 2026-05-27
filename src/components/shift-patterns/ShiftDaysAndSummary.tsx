import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DAYS_OF_WEEK, calculateHours } from '@/data/shiftPatternConfig'
import type { ShiftPatternTemplate, DayOfWeek } from '@/lib/types'

interface Props {
  formData: Partial<ShiftPatternTemplate>
  toggleDayOfWeek: (day: DayOfWeek) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ShiftDaysAndSummary({ formData, toggleDayOfWeek, t }: Props) {
  return (
    <>
      <Separator />
      <div className="space-y-3">
        <Label>{t('shiftPatterns.daysOfWeekLabel')}</Label>
        <div className="grid grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map(day => (
            <Button key={day} type="button" variant={formData.daysOfWeek?.includes(day) ? 'default' : 'outline'} size="sm" onClick={() => toggleDayOfWeek(day)} className="w-full">
              {t(`shiftPatterns.daysOfWeekShort.${day}`)}
            </Button>
          ))}
        </div>
      </div>
      {formData.defaultStartTime && formData.defaultEndTime && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">{t('shiftPatterns.patternSummary')}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('shiftPatterns.hoursPerShift')}: {calculateHours(formData.defaultStartTime, formData.defaultEndTime, formData.defaultBreakMinutes || 0).toFixed(2)}h</p>
            <p>{t('shiftPatterns.daysPerWeek')}: {formData.daysOfWeek?.length || 0}</p>
            <p>{t('shiftPatterns.totalWeeklyHours')}: {(calculateHours(formData.defaultStartTime, formData.defaultEndTime, formData.defaultBreakMinutes || 0) * (formData.daysOfWeek?.length || 0)).toFixed(2)}h</p>
          </div>
        </div>
      )}
    </>
  )
}
