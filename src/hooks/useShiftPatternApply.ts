import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { calculateHours } from '@/data/shiftPatternConfig'
import type { ShiftEntry, ShiftPatternTemplate } from '@/lib/types'
import { DAY_MAP } from './useDetailedTimesheetEntry.types'

interface Deps {
  weekEnding: string
  baseRate: string
  setShifts: React.Dispatch<React.SetStateAction<ShiftEntry[]>>
}

interface ShiftPatternApplyResult {
  patterns: ShiftPatternTemplate[]
  selectedPattern: string
  setSelectedPattern: (id: string) => void
  applyShiftPattern: () => void
}

function sortByDateTime(a: ShiftEntry, b: ShiftEntry): number {
  return (
    new Date(a.date + 'T' + a.startTime).getTime() -
    new Date(b.date + 'T' + b.startTime).getTime()
  )
}

export function useShiftPatternApply({ weekEnding, baseRate, setShifts }: Deps): ShiftPatternApplyResult {
  const [patterns = []] = useKV<ShiftPatternTemplate[]>('shift-patterns', [])
  const [selectedPattern, setSelectedPattern] = useState('')

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

  return { patterns, selectedPattern, setSelectedPattern, applyShiftPattern }
}
