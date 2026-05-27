import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PencilSimple, Trash, Clock, Moon, Sun, SunHorizon } from '@phosphor-icons/react'
import type { ShiftEntry } from '@/lib/types'

const SHIFT_ICON: Record<string, React.ReactNode> = {
  night: <Moon size={16} weight="fill" className="text-purple-500" />,
  evening: <SunHorizon size={16} weight="fill" className="text-orange-500" />,
  'early-morning': <Sun size={16} weight="fill" className="text-yellow-500" />,
}

const SHIFT_BADGE: Record<string, string> = {
  night: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  evening: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  weekend: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  holiday: 'bg-red-500/10 text-red-500 border-red-500/20',
  overtime: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'early-morning': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

interface Props {
  shift: ShiftEntry
  onEdit: (shift: ShiftEntry) => void
  onDelete: (id: string) => void
}

export function ShiftEntryCard({ shift, onEdit, onDelete }: Props) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {SHIFT_ICON[shift.shiftType] ?? <Clock size={16} className="text-muted-foreground" />}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {new Date(shift.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
                <Badge className={SHIFT_BADGE[shift.shiftType] ?? 'bg-muted text-muted-foreground border-border'}>{shift.shiftType}</Badge>
                {shift.rateMultiplier > 1.0 && <Badge variant="outline" className="text-xs">{shift.rateMultiplier}x</Badge>}
              </div>
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div><p className="text-muted-foreground">Time</p><p className="font-mono">{shift.startTime} - {shift.endTime}</p></div>
                <div><p className="text-muted-foreground">Break</p><p className="font-mono">{shift.breakMinutes} min</p></div>
                <div><p className="text-muted-foreground">Hours</p><p className="font-mono font-semibold">{shift.hours.toFixed(2)}</p></div>
                <div><p className="text-muted-foreground">Amount</p><p className="font-mono font-semibold">£{shift.amount.toFixed(2)}</p></div>
              </div>
              {shift.notes && <p className="text-xs text-muted-foreground italic">{shift.notes}</p>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(shift)}><PencilSimple size={16} /></Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(shift.id)}><Trash size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
