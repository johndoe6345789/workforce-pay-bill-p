import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ShiftEntry, ShiftType } from '@/lib/types'

const SHIFT_TYPE_INFO: Record<ShiftType, { label: string; color: string }> = {
  standard: { label: 'Standard', color: 'bg-muted' },
  overtime: { label: 'Overtime', color: 'bg-warning/20' },
  weekend: { label: 'Weekend', color: 'bg-info/20' },
  night: { label: 'Night', color: 'bg-accent/20' },
  holiday: { label: 'Holiday', color: 'bg-success/20' },
  evening: { label: 'Evening', color: 'bg-orange-500/20' },
  'early-morning': { label: 'Early Morning', color: 'bg-yellow-500/20' },
  'split-shift': { label: 'Split Shift', color: 'bg-purple-500/20' },
}

interface Props {
  shifts: ShiftEntry[]
  totalAmount: number
}

export function CalculationBreakdown({ shifts, totalAmount }: Props) {
  if (shifts.length === 0) return null

  return (
    <Card className="border-accent">
      <CardHeader><CardTitle className="text-base">Calculated Breakdown</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {shifts.map((shift, index) => {
          const info = SHIFT_TYPE_INFO[shift.shiftType]
          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn(info.color)}>{info.label}</Badge>
                <span className="text-muted-foreground">{shift.date}</span>
                <span className="font-mono">{shift.hours}h × £{shift.rate.toFixed(2)}</span>
              </div>
              <span className="font-semibold font-mono">£{shift.amount.toFixed(2)}</span>
            </div>
          )
        })}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="font-semibold">Total Amount</span>
          <span className="text-2xl font-semibold font-mono">£{totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
