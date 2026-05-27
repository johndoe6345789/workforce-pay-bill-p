import { useState } from 'react'
import { toast } from 'sonner'
import { useShiftCrud } from './useShiftCrud'
import { useShiftPatternApply } from './useShiftPatternApply'
import type { TimesheetSubmitData } from './useDetailedTimesheetEntry.types'

export type { TimesheetSubmitData } from './useDetailedTimesheetEntry.types'

export function useDetailedTimesheetEntry(onSubmit: (data: TimesheetSubmitData) => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [workerName, setWorkerName] = useState('')
  const [clientName, setClientName] = useState('')
  const [weekEnding, setWeekEnding] = useState('')
  const [baseRate, setBaseRate] = useState('25.00')

  const {
    shifts, setShifts,
    isShiftDialogOpen, setIsShiftDialogOpen,
    editingShift, setEditingShift,
    handleAddShift, handleUpdateShift, handleDeleteShift, handleEditShift,
  } = useShiftCrud()

  const { patterns, selectedPattern, setSelectedPattern, applyShiftPattern } =
    useShiftPatternApply({ weekEnding, baseRate, setShifts })

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
