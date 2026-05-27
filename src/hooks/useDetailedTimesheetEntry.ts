import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { calculateHours } from '@/data/shiftPatternConfig'
import type { ShiftEntry, ShiftPatternTemplate, DayOfWeek } from '@/lib/types'

export interface TimesheetSubmitData {
  workerName: string
  clientName: string
  weekEnding: string
  shifts: ShiftEntry[]
  totalHours: number
  totalAmount: number
  baseRate: number
}

const DAY_MAP: Record<DayOfWeek, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6
}

export function useDetailedTimesheetEntry(onSubmit: (data: TimesheetSubmitData) => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftEntry | undefined>(undefined)
  const [workerName, setWorkerName] = useState('')
  const [clientName, setClientName] = useState('')
  const [weekEnding, setWeekEnding] = useState('')
  const [baseRate, setBaseRate] = useState('25.00')
  const [shifts, setShifts] = useState<ShiftEntry[]>([])
  const [patterns = []] = useKV<ShiftPatternTemplate[]>('shift-patterns', [])
  const [selectedPattern, setSelectedPattern] = useState('')

  const sortByDateTime = (a: ShiftEntry, b: ShiftEntry) =>
    new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime()

  const handleAddShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    const newShift: ShiftEntry = { ...shiftData, id: `shift-${Date.now()}-${Math.random()}` }
    setShifts(prev => [...prev, newShift].sort(sortByDateTime))
    toast.success('Shift added successfully')
  }

  const handleUpdateShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    if (!editingShift) return
    setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...shiftData, id: s.id } : s).sort(sortByDateTime))
    setEditingShift(undefined)
    toast.success('Shift updated successfully')
  }

  const handleDeleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId))
    toast.success('Shift removed')
  }

  const handleEditShift = (shift: ShiftEntry) => {
    setEditingShift(shift)
    setIsShiftDialogOpen(true)
  }

  const applyShiftPattern = () => {
    if (!selectedPattern || !weekEnding) {
      toast.error('Please select a pattern and set the week ending date')
      return
    }
    const pattern = patterns.find(p => p.id === selectedPattern)
    if (!pattern) return

    const weekEndDate = new Date(weekEnding)
    const generatedShifts: ShiftEntry[] = pattern.daysOfWeek.map(dayOfWeek => {
      const targetDayIndex = DAY_MAP[dayOfWeek]
      const weekEndDayIndex = weekEndDate.getDay()
      let daysBack = weekEndDayIndex - targetDayIndex
      if (daysBack < 0) daysBack += 7

      const shiftDate = new Date(weekEndDate)
      shiftDate.setDate(shiftDate.getDate() - daysBack)

      const hours = calculateHours(pattern.defaultStartTime, pattern.defaultEndTime, pattern.defaultBreakMinutes)
      const rate = parseFloat(baseRate) * pattern.rateMultiplier

      return {
        id: `shift-${Date.now()}-${Math.random()}`,
        date: shiftDate.toISOString().split('T')[0],
        dayOfWeek,
        shiftType: pattern.shiftType,
        startTime: pattern.defaultStartTime,
        endTime: pattern.defaultEndTime,
        breakMinutes: pattern.defaultBreakMinutes,
        hours,
        rate,
        rateMultiplier: pattern.rateMultiplier,
        amount: hours * rate,
        notes: `Applied from pattern: ${pattern.name}`
      }
    })

    setShifts(prev => [...prev, ...generatedShifts].sort(sortByDateTime))
    toast.success(`Applied ${generatedShifts.length} shifts from pattern "${pattern.name}"`)
    setSelectedPattern('')
  }

  const handleSubmit = () => {
    if (!workerName || !clientName || !weekEnding) {
      toast.error('Please fill in worker, client, and week ending')
      return
    }
    if (!shifts.length) {
      toast.error('Please add at least one shift')
      return
    }
    const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0)
    const totalAmount = shifts.reduce((sum, s) => sum + s.amount, 0)
    onSubmit({ workerName, clientName, weekEnding, shifts, totalHours, totalAmount, baseRate: parseFloat(baseRate) })
    setWorkerName(''); setClientName(''); setWeekEnding(''); setBaseRate('25.00'); setShifts([])
    setIsOpen(false)
  }

  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0)
  const totalAmount = shifts.reduce((sum, s) => sum + s.amount, 0)

  return {
    isOpen, setIsOpen,
    isShiftDialogOpen, setIsShiftDialogOpen,
    editingShift, setEditingShift,
    workerName, setWorkerName,
    clientName, setClientName,
    weekEnding, setWeekEnding,
    baseRate, setBaseRate,
    shifts, patterns,
    selectedPattern, setSelectedPattern,
    totalHours, totalAmount,
    handleAddShift, handleUpdateShift, handleDeleteShift, handleEditShift,
    applyShiftPattern, handleSubmit,
  }
}
