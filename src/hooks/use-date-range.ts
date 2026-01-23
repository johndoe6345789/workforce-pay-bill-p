import { useState, useCallback } from 'react'
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns'

export type DateRangePreset = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last7Days' | 'last30Days' | 'custom'

export interface DateRange {
  from: Date
  to: Date
}

export function useDateRange(initialRange?: DateRange) {
  const [dateRange, setDateRange] = useState<DateRange>(
    initialRange || {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    }
  )
  const [preset, setPreset] = useState<DateRangePreset>('thisMonth')

  const applyPreset = useCallback((presetName: DateRangePreset) => {
    const now = new Date()
    let from: Date
    let to: Date

    switch (presetName) {
      case 'today':
        from = new Date(now.setHours(0, 0, 0, 0))
        to = new Date(now.setHours(23, 59, 59, 999))
        break
      case 'yesterday':
        from = subDays(new Date(now.setHours(0, 0, 0, 0)), 1)
        to = subDays(new Date(now.setHours(23, 59, 59, 999)), 1)
        break
      case 'thisWeek':
        from = startOfWeek(now, { weekStartsOn: 1 })
        to = endOfWeek(now, { weekStartsOn: 1 })
        break
      case 'lastWeek':
        from = startOfWeek(subDays(now, 7), { weekStartsOn: 1 })
        to = endOfWeek(subDays(now, 7), { weekStartsOn: 1 })
        break
      case 'thisMonth':
        from = startOfMonth(now)
        to = endOfMonth(now)
        break
      case 'lastMonth':
        from = startOfMonth(subMonths(now, 1))
        to = endOfMonth(subMonths(now, 1))
        break
      case 'last7Days':
        from = subDays(now, 6)
        to = now
        break
      case 'last30Days':
        from = subDays(now, 29)
        to = now
        break
      default:
        return
    }

    setDateRange({ from, to })
    setPreset(presetName)
  }, [])

  const setCustomRange = useCallback((range: DateRange) => {
    setDateRange(range)
    setPreset('custom')
  }, [])

  return {
    dateRange,
    preset,
    applyPreset,
    setCustomRange,
    setDateRange: setCustomRange
  }
}
