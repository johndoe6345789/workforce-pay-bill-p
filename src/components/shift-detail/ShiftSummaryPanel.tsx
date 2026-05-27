import { Badge } from '@/components/ui/badge'
import { Moon, Sun, SunHorizon, Clock, Coffee, Warning } from '@phosphor-icons/react'
import type { ShiftType, DayOfWeek } from '@/lib/types'

const SHIFT_ICON: Partial<Record<ShiftType, React.ReactNode>> = {
  night: <Moon size={16} weight="fill" />,
  evening: <SunHorizon size={16} weight="fill" />,
  'early-morning': <Sun size={16} weight="fill" />,
}

const SHIFT_COLOR: Partial<Record<ShiftType, string>> = {
  night: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  evening: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  weekend: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  holiday: 'bg-red-500/10 text-red-500 border-red-500/20',
  overtime: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'early-morning': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

interface Props {
  shiftType: ShiftType
  hours: number
  dayOfWeek: DayOfWeek
  baseRate: number
  multiplier: number
  effectiveRate: number
  amount: number
}

export function ShiftSummaryPanel({ shiftType, hours, dayOfWeek, baseRate, multiplier, effectiveRate, amount }: Props) {
  return (
    <div className="col-span-2 border rounded-lg p-4 bg-muted/50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Shift Summary</span>
        <Badge className={SHIFT_COLOR[shiftType] ?? 'bg-muted text-muted-foreground border-border'}>
          <span className="flex items-center gap-1">{SHIFT_ICON[shiftType] ?? <Clock size={16} />}{shiftType}</span>
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-muted-foreground">Working Hours</p><p className="font-mono font-semibold">{hours.toFixed(2)} hrs</p></div>
        <div><p className="text-muted-foreground">Day of Week</p><p className="font-medium capitalize">{dayOfWeek}</p></div>
        <div><p className="text-muted-foreground">Base Rate</p><p className="font-mono font-semibold">£{baseRate.toFixed(2)}/hr</p></div>
        <div><p className="text-muted-foreground">Rate Multiplier</p><p className="font-mono font-semibold">{multiplier.toFixed(2)}x</p></div>
        <div><p className="text-muted-foreground">Effective Rate</p><p className="font-mono font-semibold text-accent">£{effectiveRate.toFixed(2)}/hr</p></div>
        <div><p className="text-muted-foreground">Total Amount</p><p className="font-mono font-semibold text-lg text-accent">£{amount.toFixed(2)}</p></div>
      </div>
      {multiplier > 1.0 && (
        <div className="flex items-start gap-2 pt-2 border-t border-border">
          <Coffee size={16} className="text-accent mt-0.5" />
          <p className="text-xs text-muted-foreground">This shift qualifies for a {((multiplier - 1) * 100).toFixed(0)}% premium rate</p>
        </div>
      )}
      {hours > 12 && (
        <div className="flex items-start gap-2 pt-2 border-t border-border">
          <Warning size={16} className="text-warning mt-0.5" />
          <p className="text-xs text-warning">Long shift: {hours.toFixed(2)} hours exceeds 12 hours</p>
        </div>
      )}
    </div>
  )
}
