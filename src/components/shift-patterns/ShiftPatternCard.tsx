import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Trash, Copy, PencilSimple } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { getShiftTypeConfig, calculateHours } from '@/data/shiftPatternConfig'
import type { ShiftPatternTemplate } from '@/lib/types'

interface Props {
  pattern: ShiftPatternTemplate
  onEdit: (p: ShiftPatternTemplate) => void
  onDuplicate: (p: ShiftPatternTemplate) => void
  onDelete: (id: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ShiftPatternCard({ pattern, onEdit, onDuplicate, onDelete, t }: Props) {
  const shiftConfig = getShiftTypeConfig(pattern.shiftType)
  const ShiftIcon = shiftConfig.icon
  const hours = calculateHours(pattern.defaultStartTime, pattern.defaultEndTime, pattern.defaultBreakMinutes)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn('p-2 rounded-lg', shiftConfig.color)}>
                <ShiftIcon size={24} weight="fill" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{pattern.name}</h3>
                  <Badge className={shiftConfig.color}>{shiftConfig.label}</Badge>
                </div>
                {pattern.description && <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={14} />{pattern.defaultStartTime} - {pattern.defaultEndTime}</span>
                  <span>•</span>
                  <span>{hours.toFixed(2)}h per shift</span>
                  {pattern.rateMultiplier > 1.0 && (<><span>•</span><span className="text-accent font-medium">{pattern.rateMultiplier}× rate</span></>)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {pattern.daysOfWeek.map(day => (
              <Badge key={day} variant="outline" className="text-xs">{t(`shiftPatterns.daysOfWeekShort.${day}`)}</Badge>
            ))}
          </div>

          <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('shiftPatterns.weeklyHours')}:</span>
              <span className="font-mono font-medium">{t('shiftPatterns.hoursLabel', { hours: (hours * pattern.daysOfWeek.length).toFixed(2) })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('shiftPatterns.breakTime')}:</span>
              <span className="font-mono font-medium">{pattern.defaultBreakMinutes} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('shiftPatterns.timesUsed')}:</span>
              <span className="font-mono font-medium">{pattern.usageCount}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(pattern)}>
              <PencilSimple size={16} className="mr-2" />{t('shiftPatterns.edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDuplicate(pattern)}>
              <Copy size={16} className="mr-2" />{t('shiftPatterns.duplicate')}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(pattern.id)}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
