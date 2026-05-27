import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { ShiftEntry, ShiftType, DayOfWeek } from '@/lib/types'

const DAYS: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export type ShiftForm = {
  date: string
  startTime: string
  endTime: string
  breakMinutes: string
  shiftType: ShiftType
  notes: string
}

function makeDefaultForm(date?: string): ShiftForm {
  return {
    date: date || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: '30',
    shiftType: 'standard',
    notes: '',
  }
}

function calcHours(startTime: string, endTime: string, breakMinutes: string): number {
  if (!startTime || !endTime) return 0
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let start = sh * 60 + sm
  let end = eh * 60 + em
  if (end < start) end += 24 * 60
  return Number((Math.max(0, end - start - (parseInt(breakMinutes) || 0)) / 60).toFixed(2))
}

export function calcMultiplier(shiftType: ShiftType, date: string, startTime: string): number {
  const dayOfWeek = new Date(date).getDay()
  const [hour] = startTime.split(':').map(Number)
  if (shiftType === 'holiday') return 2.0
  if (shiftType === 'weekend' || dayOfWeek === 0 || dayOfWeek === 6) return 1.5
  if (shiftType === 'night' || hour >= 22 || hour < 6) return 1.3
  if (shiftType === 'evening' || (hour >= 18 && hour < 22)) return 1.2
  if (shiftType === 'early-morning' || (hour >= 6 && hour < 8)) return 1.1
  if (shiftType === 'overtime') return 1.5
  return 1.0
}

function getDayOfWeek(date: string): DayOfWeek {
  return DAYS[new Date(date).getDay()]
}

interface Options {
  existingShift?: ShiftEntry
  baseRate: number
  date?: string
  onSave: (shift: Omit<ShiftEntry, 'id'>) => void
  onOpenChange: (open: boolean) => void
}

export function useShiftDetailDialog({ existingShift, baseRate, date, onSave, onOpenChange }: Options) {
  const [formData, setFormData] = useState<ShiftForm>(makeDefaultForm(date))

  useEffect(() => {
    if (existingShift) {
      setFormData({
        date: existingShift.date,
        startTime: existingShift.startTime,
        endTime: existingShift.endTime,
        breakMinutes: existingShift.breakMinutes.toString(),
        shiftType: existingShift.shiftType,
        notes: existingShift.notes || '',
      })
    } else if (date) {
      setFormData(prev => ({ ...prev, date }))
    }
  }, [existingShift, date])

  const patch = (updates: Partial<ShiftForm>) => setFormData({ ...formData, ...updates })

  const hours = calcHours(formData.startTime, formData.endTime, formData.breakMinutes)
  const multiplier = calcMultiplier(formData.shiftType, formData.date, formData.startTime)
  const effectiveRate = baseRate * multiplier
  const amount = hours * effectiveRate

  const handleSave = () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields')
      return
    }
    if (hours <= 0) { toast.error('End time must be after start time'); return }
    onSave({
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
      notes: formData.notes || undefined,
    })
    onOpenChange(false)
    setFormData(makeDefaultForm(date))
  }

  return {
    formData, patch,
    hours, multiplier, effectiveRate, amount,
    handleSave,
    getDayOfWeek,
  }
}
