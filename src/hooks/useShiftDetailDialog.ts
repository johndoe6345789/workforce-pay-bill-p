import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { ShiftForm, ShiftDetailDialogOptions } from './useShiftDetailDialog.types'
import {
  makeDefaultForm,
  calcHours,
  calcMultiplier,
  getDayOfWeek,
} from './useShiftDetailDialog.utils'

export type { ShiftForm } from './useShiftDetailDialog.types'
export { calcMultiplier } from './useShiftDetailDialog.utils'

export function useShiftDetailDialog({
  existingShift,
  baseRate,
  date,
  onSave,
  onOpenChange,
}: ShiftDetailDialogOptions) {
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
