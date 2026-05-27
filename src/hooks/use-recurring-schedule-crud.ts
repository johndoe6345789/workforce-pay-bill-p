import { useCallback } from 'react'
import type { RecurringSchedule } from './use-recurring-schedule.types'

type SetSchedules = React.Dispatch<React.SetStateAction<RecurringSchedule[]>>

export function useRecurringScheduleCrud(setSchedules: SetSchedules) {
  const addSchedule = useCallback(
    (schedule: Omit<RecurringSchedule, 'id'>) => {
      const newSchedule: RecurringSchedule = {
        ...schedule,
        id: `SCHED-${Date.now()}`,
      }
      setSchedules((prev) => [...prev, newSchedule])
      return newSchedule
    },
    [setSchedules]
  )

  const removeSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) => prev.filter((s) => s.id !== id))
    },
    [setSchedules]
  )

  const updateSchedule = useCallback(
    (id: string, updates: Partial<RecurringSchedule>) => {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      )
    },
    [setSchedules]
  )

  return { addSchedule, removeSchedule, updateSchedule }
}
