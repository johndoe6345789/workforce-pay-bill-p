import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash } from '@phosphor-icons/react'
import type { ShiftType } from '@/lib/types'
import type { ShiftRow } from '@/hooks/useShiftPremiumCalculator'

const SHIFT_TYPE_OPTIONS: { value: ShiftType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'night', label: 'Night' },
  { value: 'holiday', label: 'Holiday' },
]

interface Props {
  shifts: ShiftRow[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, field: keyof ShiftRow, value: string) => void
}

export function ShiftEntryList({ shifts, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Shifts</Label>
        <Button size="sm" variant="outline" onClick={onAdd}><Plus size={16} className="mr-2" />Add Shift</Button>
      </div>
      {shifts.map((shift, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4 space-y-2">
                <Label>Date</Label>
                <Input type="date" value={shift.date} onChange={e => onUpdate(index, 'date', e.target.value)} />
              </div>
              <div className="col-span-4 space-y-2">
                <Label>Shift Type</Label>
                <Select value={shift.shiftType} onValueChange={value => onUpdate(index, 'shiftType', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SHIFT_TYPE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 space-y-2">
                <Label>Hours</Label>
                <Input type="number" step="0.5" placeholder="8" value={shift.hours} onChange={e => onUpdate(index, 'hours', e.target.value)} />
              </div>
              <div className="col-span-1 flex items-end">
                <Button size="sm" variant="ghost" onClick={() => onRemove(index)} disabled={shifts.length === 1}><Trash size={16} /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
