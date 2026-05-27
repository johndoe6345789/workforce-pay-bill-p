import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Calendar, Lightning } from '@phosphor-icons/react'
import { ShiftEntryCard } from '@/components/timesheet/ShiftEntryCard'
import type { ShiftEntry, ShiftPatternTemplate } from '@/lib/types'

interface Props {
  shifts: ShiftEntry[]
  patterns: ShiftPatternTemplate[]
  selectedPattern: string
  setSelectedPattern: (v: string) => void
  applyShiftPattern: () => void
  onAddShift: () => void
  onEditShift: (shift: ShiftEntry) => void
  onDeleteShift: (id: string) => void
  totalHours: number
  totalAmount: number
}

export function TimesheetShiftsSection({ shifts, patterns, selectedPattern, setSelectedPattern, applyShiftPattern, onAddShift, onEditShift, onDeleteShift, totalHours, totalAmount }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Shifts ({shifts.length})</Label>
        <div className="flex gap-2">
          {patterns.length > 0 && (
            <>
              <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Choose pattern..." /></SelectTrigger>
                <SelectContent>
                  {patterns.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={applyShiftPattern} disabled={!selectedPattern}>
                <Lightning size={16} className="mr-2" />Apply
              </Button>
              <Separator orientation="vertical" className="h-8" />
            </>
          )}
          <Button size="sm" onClick={onAddShift}>
            <Plus size={16} className="mr-2" />Add Shift
          </Button>
        </div>
      </div>

      <ScrollArea className="h-64 border rounded-lg">
        {!shifts.length ? (
          <div className="p-8 text-center text-muted-foreground">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No shifts added yet</p>
            <p className="text-xs mt-1">Click "Add Shift" to get started</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {shifts.map(shift => (
              <ShiftEntryCard key={shift.id} shift={shift} onEdit={onEditShift} onDelete={onDeleteShift} />
            ))}
          </div>
        )}
      </ScrollArea>

      {shifts.length > 0 && (
        <Card className="bg-accent/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-muted-foreground">Total Shifts</p><p className="font-semibold text-lg">{shifts.length}</p></div>
              <div><p className="text-muted-foreground">Total Hours</p><p className="font-mono font-semibold text-lg">{totalHours.toFixed(2)}</p></div>
              <div><p className="text-muted-foreground">Total Amount</p><p className="font-mono font-semibold text-lg text-accent">£{totalAmount.toFixed(2)}</p></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
