import type { ShiftEntry, ShiftType } from '@/lib/types'

export type ShiftForm = {
  date: string
  startTime: string
  endTime: string
  breakMinutes: string
  shiftType: ShiftType
  notes: string
}

export interface ShiftDetailDialogOptions {
  existingShift?: ShiftEntry
  baseRate: number
  date?: string
  onSave: (shift: Omit<ShiftEntry, 'id'>) => void
  onOpenChange: (open: boolean) => void
}
