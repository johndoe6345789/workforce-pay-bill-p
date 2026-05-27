import { useState } from 'react'
import { toast } from 'sonner'
import type { RateCard, ShiftEntry, ShiftType } from '@/lib/types'

const MULTIPLIER_MAP: Partial<Record<ShiftType, (rc: RateCard) => number>> = {
  overtime: rc => rc.overtimeMultiplier,
  weekend: rc => rc.weekendMultiplier,
  night: rc => rc.nightMultiplier,
  holiday: rc => rc.holidayMultiplier,
  evening: () => 1.2,
  'early-morning': () => 1.1,
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export type ShiftRow = { date: string; shiftType: ShiftType; hours: string }

function getMultiplier(shiftType: ShiftType, rateCard: RateCard): number {
  return MULTIPLIER_MAP[shiftType]?.(rateCard) ?? 1.0
}

function getDayOfWeek(dateStr: string) {
  return DAYS[new Date(dateStr).getDay()]
}

interface Options {
  rateCards: RateCard[]
  onCalculate: (shifts: ShiftEntry[], totalAmount: number) => void
}

export function useShiftPremiumCalculator({ rateCards, onCalculate }: Options) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRateCardId, setSelectedRateCardId] = useState('')
  const [shifts, setShifts] = useState<ShiftRow[]>([{ date: '', shiftType: 'standard', hours: '' }])

  const selectedRateCard = rateCards.find(rc => rc.id === selectedRateCardId)

  const calculateShifts = (): ShiftEntry[] => {
    if (!selectedRateCard) return []
    return shifts.filter(s => s.date && s.hours).map((shift, index) => {
      const hours = parseFloat(shift.hours)
      const multiplier = getMultiplier(shift.shiftType, selectedRateCard)
      const rate = selectedRateCard.standardRate * multiplier
      return {
        id: `SHIFT-${Date.now()}-${index}`,
        date: shift.date,
        dayOfWeek: getDayOfWeek(shift.date),
        shiftType: shift.shiftType,
        startTime: '09:00',
        endTime: '17:00',
        breakMinutes: 0,
        hours,
        rate,
        rateMultiplier: multiplier,
        amount: hours * rate,
      }
    })
  }

  const addShift = () => setShifts([...shifts, { date: '', shiftType: 'standard', hours: '' }])
  const removeShift = (index: number) => setShifts(shifts.filter((_, i) => i !== index))
  const updateShift = (index: number, field: keyof ShiftRow, value: string) => {
    const updated = [...shifts]
    updated[index] = { ...updated[index], [field]: value }
    setShifts(updated)
  }

  const handleCalculate = () => {
    if (!selectedRateCardId) { toast.error('Please select a rate card'); return }
    const calculatedShifts = calculateShifts()
    if (calculatedShifts.length === 0) { toast.error('Please add at least one valid shift'); return }
    const totalAmount = calculatedShifts.reduce((sum, s) => sum + s.amount, 0)
    onCalculate(calculatedShifts, totalAmount)
    toast.success(`Calculated ${calculatedShifts.length} shifts totaling £${totalAmount.toFixed(2)}`)
    setSelectedRateCardId('')
    setShifts([{ date: '', shiftType: 'standard', hours: '' }])
    setIsOpen(false)
  }

  const calculatedShifts = selectedRateCard ? calculateShifts() : []
  const totalAmount = calculatedShifts.reduce((sum, s) => sum + s.amount, 0)

  return {
    isOpen, setIsOpen,
    selectedRateCardId, setSelectedRateCardId,
    selectedRateCard,
    shifts, addShift, removeShift, updateShift,
    calculatedShifts, totalAmount,
    handleCalculate,
  }
}
