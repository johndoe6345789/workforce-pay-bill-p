import { useState } from 'react'
import { toast } from 'sonner'
import type { ShiftEntry } from '@/lib/types'

function sortByDateTime(a: ShiftEntry, b: ShiftEntry): number {
  return (
    new Date(a.date + 'T' + a.startTime).getTime() -
    new Date(b.date + 'T' + b.startTime).getTime()
  )
}

interface ShiftCrudResult {
  shifts: ShiftEntry[]
  setShifts: React.Dispatch<React.SetStateAction<ShiftEntry[]>>
  isShiftDialogOpen: boolean
  setIsShiftDialogOpen: (open: boolean) => void
  editingShift: ShiftEntry | undefined
  setEditingShift: (shift: ShiftEntry | undefined) => void
  handleAddShift: (shiftData: Omit<ShiftEntry, 'id'>) => void
  handleUpdateShift: (shiftData: Omit<ShiftEntry, 'id'>) => void
  handleDeleteShift: (shiftId: string) => void
  handleEditShift: (shift: ShiftEntry) => void
}

export function useShiftCrud(): ShiftCrudResult {
  const [shifts, setShifts] = useState<ShiftEntry[]>([])
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<ShiftEntry | undefined>(undefined)

  const handleAddShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    const newShift: ShiftEntry = { ...shiftData, id: `shift-${Date.now()}-${Math.random()}` }
    setShifts(prev => [...prev, newShift].sort(sortByDateTime))
    toast.success('Shift added successfully')
  }

  const handleUpdateShift = (shiftData: Omit<ShiftEntry, 'id'>) => {
    if (!editingShift) return
    setShifts(prev =>
      prev.map(s => s.id === editingShift.id ? { ...shiftData, id: s.id } : s).sort(sortByDateTime)
    )
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

  return {
    shifts, setShifts,
    isShiftDialogOpen, setIsShiftDialogOpen,
    editingShift, setEditingShift,
    handleAddShift, handleUpdateShift, handleDeleteShift, handleEditShift,
  }
}
