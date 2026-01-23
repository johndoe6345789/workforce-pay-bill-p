import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, Moon, Sun, SunHorizon, Coffee, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ShiftEntry, ShiftType, DayOfWeek } from '@/lib/types'

interface ShiftDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (shift: Omit<ShiftEntry, 'id'>) => void
  existingShift?: ShiftEntry
  baseRate: number
  date?: string
}

export function ShiftDetailDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  existingShift,
  baseRate,
  date
}: ShiftDetailDialogProps) {
  const [formData, setFormData] = useState<{
    date: string
    startTime: string
    endTime: string
    breakMinutes: string
    shiftType: ShiftType
    notes: string
  }>({
    date: date || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: '30',
    shiftType: 'standard',
    notes: ''
  })

  useEffect(() => {
    if (existingShift) {
      setFormData({
        date: existingShift.date,
        startTime: existingShift.startTime,
        endTime: existingShift.endTime,
        breakMinutes: existingShift.breakMinutes.toString(),
        shiftType: existingShift.shiftType,
        notes: existingShift.notes || ''
      })
    } else if (date) {
      setFormData(prev => ({ ...prev, date }))
    }
  }, [existingShift, date])

  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0
    
    const [startHour, startMin] = formData.startTime.split(':').map(Number)
    const [endHour, endMin] = formData.endTime.split(':').map(Number)
    
    let startMinutes = startHour * 60 + startMin
    let endMinutes = endHour * 60 + endMin
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60
    }
    
    const totalMinutes = endMinutes - startMinutes
    const breakMins = parseInt(formData.breakMinutes) || 0
    const workMinutes = Math.max(0, totalMinutes - breakMins)
    
    return Number((workMinutes / 60).toFixed(2))
  }

  const calculateMultiplier = (shiftType: ShiftType, date: string, startTime: string): number => {
    const dayOfWeek = new Date(date).getDay()
    const [hour] = startTime.split(':').map(Number)
    
    if (shiftType === 'holiday') return 2.0
    if (shiftType === 'weekend' || dayOfWeek === 0 || dayOfWeek === 6) return 1.5
    if (shiftType === 'night' || (hour >= 22 || hour < 6)) return 1.3
    if (shiftType === 'evening' || (hour >= 18 && hour < 22)) return 1.2
    if (shiftType === 'early-morning' || (hour >= 6 && hour < 8)) return 1.1
    if (shiftType === 'overtime') return 1.5
    
    return 1.0
  }

  const getDayOfWeek = (date: string): DayOfWeek => {
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date(date).getDay()]
  }

  const getShiftTypeIcon = (shiftType: ShiftType) => {
    switch (shiftType) {
      case 'night': return <Moon size={16} weight="fill" />
      case 'evening': return <SunHorizon size={16} weight="fill" />
      case 'early-morning': return <Sun size={16} weight="fill" />
      default: return <Clock size={16} />
    }
  }

  const getShiftTypeColor = (shiftType: ShiftType) => {
    switch (shiftType) {
      case 'night': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'evening': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'weekend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'holiday': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'overtime': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'early-morning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const hours = calculateHours()
  const multiplier = calculateMultiplier(formData.shiftType, formData.date, formData.startTime)
  const effectiveRate = baseRate * multiplier
  const amount = hours * effectiveRate

  const handleSave = () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    if (hours <= 0) {
      toast.error('End time must be after start time')
      return
    }

    const shift: Omit<ShiftEntry, 'id'> = {
      date: formData.date,
      dayOfWeek: getDayOfWeek(formData.date),
      shiftType: formData.shiftType,
      startTime: formData.startTime,
      endTime: formData.endTime,
      breakMinutes: parseInt(formData.breakMinutes) || 0,
      hours,
      rate: effectiveRate,
      rateMultiplier: multiplier,
      amount,
      notes: formData.notes || undefined
    }

    onSave(shift)
    onOpenChange(false)
    
    setFormData({
      date: date || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      breakMinutes: '30',
      shiftType: 'standard',
      notes: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock size={20} />
            {existingShift ? 'Edit Shift' : 'Add Shift'}
          </DialogTitle>
          <DialogDescription>
            Enter detailed shift information including start/end times and breaks
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="shift-date">Date *</Label>
            <Input
              id="shift-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time *</Label>
            <Input
              id="start-time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time *</Label>
            <Input
              id="end-time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="break-minutes">Break (minutes)</Label>
            <Input
              id="break-minutes"
              type="number"
              min="0"
              step="15"
              value={formData.breakMinutes}
              onChange={(e) => setFormData({ ...formData, breakMinutes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift-type">Shift Type</Label>
            <Select
              value={formData.shiftType}
              onValueChange={(value: ShiftType) => setFormData({ ...formData, shiftType: value })}
            >
              <SelectTrigger id="shift-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="early-morning">Early Morning (6am-8am)</SelectItem>
                <SelectItem value="evening">Evening (6pm-10pm)</SelectItem>
                <SelectItem value="night">Night (10pm-6am)</SelectItem>
                <SelectItem value="weekend">Weekend</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="split-shift">Split Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="shift-notes">Notes</Label>
            <Textarea
              id="shift-notes"
              placeholder="Add any notes about this shift..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="col-span-2 border rounded-lg p-4 bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Shift Summary</span>
              <Badge className={getShiftTypeColor(formData.shiftType)}>
                <span className="flex items-center gap-1">
                  {getShiftTypeIcon(formData.shiftType)}
                  {formData.shiftType}
                </span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Working Hours</p>
                <p className="font-mono font-semibold">{hours.toFixed(2)} hrs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Day of Week</p>
                <p className="font-medium capitalize">{getDayOfWeek(formData.date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Base Rate</p>
                <p className="font-mono font-semibold">£{baseRate.toFixed(2)}/hr</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rate Multiplier</p>
                <p className="font-mono font-semibold">{multiplier.toFixed(2)}x</p>
              </div>
              <div>
                <p className="text-muted-foreground">Effective Rate</p>
                <p className="font-mono font-semibold text-accent">£{effectiveRate.toFixed(2)}/hr</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-mono font-semibold text-lg text-accent">£{amount.toFixed(2)}</p>
              </div>
            </div>

            {multiplier > 1.0 && (
              <div className="flex items-start gap-2 pt-2 border-t border-border">
                <Coffee size={16} className="text-accent mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  This shift qualifies for a {((multiplier - 1) * 100).toFixed(0)}% premium rate
                </p>
              </div>
            )}

            {hours > 12 && (
              <div className="flex items-start gap-2 pt-2 border-t border-border">
                <Warning size={16} className="text-warning mt-0.5" />
                <p className="text-xs text-warning">
                  Long shift: {hours.toFixed(2)} hours exceeds 12 hours
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {existingShift ? 'Update Shift' : 'Add Shift'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
