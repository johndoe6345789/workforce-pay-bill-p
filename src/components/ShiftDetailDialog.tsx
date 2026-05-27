import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Clock } from '@phosphor-icons/react'
import type { ShiftEntry, ShiftType } from '@/lib/types'
import { useShiftDetailDialog } from '@/hooks/useShiftDetailDialog'
import { ShiftSummaryPanel } from '@/components/shift-detail/ShiftSummaryPanel'

interface ShiftDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (shift: Omit<ShiftEntry, 'id'>) => void
  existingShift?: ShiftEntry
  baseRate: number
  date?: string
}

const SHIFT_TYPE_OPTIONS: { value: ShiftType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'early-morning', label: 'Early Morning (6am-8am)' },
  { value: 'evening', label: 'Evening (6pm-10pm)' },
  { value: 'night', label: 'Night (10pm-6am)' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'split-shift', label: 'Split Shift' },
]

export function ShiftDetailDialog({ open, onOpenChange, onSave, existingShift, baseRate, date }: ShiftDetailDialogProps) {
  const vm = useShiftDetailDialog({ existingShift, baseRate, date, onSave, onOpenChange })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock size={20} />{existingShift ? 'Edit Shift' : 'Add Shift'}
          </DialogTitle>
          <DialogDescription>Enter detailed shift information including start/end times and breaks</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="shift-date">Date *</Label>
            <Input id="shift-date" type="date" value={vm.formData.date} onChange={e => vm.patch({ date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time *</Label>
            <Input id="start-time" type="time" value={vm.formData.startTime} onChange={e => vm.patch({ startTime: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time *</Label>
            <Input id="end-time" type="time" value={vm.formData.endTime} onChange={e => vm.patch({ endTime: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-minutes">Break (minutes)</Label>
            <Input id="break-minutes" type="number" min="0" step="15" value={vm.formData.breakMinutes} onChange={e => vm.patch({ breakMinutes: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shift-type">Shift Type</Label>
            <Select value={vm.formData.shiftType} onValueChange={value => vm.patch({ shiftType: value as ShiftType })}>
              <SelectTrigger id="shift-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIFT_TYPE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="shift-notes">Notes</Label>
            <Textarea id="shift-notes" placeholder="Add any notes about this shift..." value={vm.formData.notes} onChange={e => vm.patch({ notes: e.target.value })} rows={2} />
          </div>

          <ShiftSummaryPanel
            shiftType={vm.formData.shiftType}
            hours={vm.hours}
            dayOfWeek={vm.getDayOfWeek(vm.formData.date)}
            baseRate={baseRate}
            multiplier={vm.multiplier}
            effectiveRate={vm.effectiveRate}
            amount={vm.amount}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={vm.handleSave}>{existingShift ? 'Update Shift' : 'Add Shift'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
