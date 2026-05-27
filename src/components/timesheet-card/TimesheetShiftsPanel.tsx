import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { ShiftEntry } from '@/lib/types'

const SHIFT_BADGE_COLORS: Record<string, string> = {
  night: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  evening: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  weekend: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  holiday: 'bg-red-500/10 text-red-500 border-red-500/20',
  overtime: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'early-morning': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}
const SHIFT_DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }

interface Props { shifts: ShiftEntry[]; showShifts: boolean; onToggle: (e: React.MouseEvent) => void }

export function TimesheetShiftsPanel({ shifts, showShifts, onToggle }: Props) {
  return (
    <div className="mt-3">
      <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 px-2 text-xs">
        {showShifts ? 'Hide' : 'Show'} Shift Details
        <CaretDown size={14} className={cn('ml-1 transition-transform', showShifts && 'rotate-180')} />
      </Button>
      {showShifts && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-accent/30">
          {shifts.map(shift => (
            <div key={shift.id} className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{new Date(shift.date).toLocaleDateString('en-GB', SHIFT_DATE_FORMAT)}</span>
                <Badge className={SHIFT_BADGE_COLORS[shift.shiftType] ?? 'bg-muted text-muted-foreground border-border'}>{shift.shiftType}</Badge>
                <span className="font-mono text-muted-foreground">{shift.startTime} - {shift.endTime}</span>
                {shift.rateMultiplier > 1.0 && <Badge variant="outline" className="text-xs">{shift.rateMultiplier}x</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono">{shift.hours.toFixed(2)}h</span>
                <span className="font-mono font-semibold">£{shift.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
