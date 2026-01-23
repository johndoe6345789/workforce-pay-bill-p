import { useState, useCallback, useMemo } from 'react'
import { addDays, startOfWeek, format, parseISO } from 'date-fns'

export interface RecurringSchedule {
  id: string
  name: string
  pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  startDate: string
  endDate?: string
  daysOfWeek?: number[]
  timeSlots: Array<{
    startTime: string
    endTime: string
    description?: string
  }>
}

export interface ScheduleInstance {
  date: string
  dayOfWeek: number
  timeSlots: Array<{
    startTime: string
    endTime: string
    description?: string
  }>
}

export function useRecurringSchedule() {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([])

  const addSchedule = useCallback((schedule: Omit<RecurringSchedule, 'id'>) => {
    const newSchedule: RecurringSchedule = {
      ...schedule,
      id: `SCHED-${Date.now()}`,
    }
    setSchedules((prev) => [...prev, newSchedule])
    return newSchedule
  }, [])

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const updateSchedule = useCallback(
    (id: string, updates: Partial<RecurringSchedule>) => {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      )
    },
    []
  )

  const generateInstances = useCallback(
    (schedule: RecurringSchedule, startDate: Date, endDate: Date): ScheduleInstance[] => {
      const instances: ScheduleInstance[] = []
      const scheduleStart = parseISO(schedule.startDate)
      const scheduleEnd = schedule.endDate ? parseISO(schedule.endDate) : endDate

      let currentDate = scheduleStart > startDate ? scheduleStart : startDate

      while (currentDate <= endDate && currentDate <= scheduleEnd) {
        const dayOfWeek = currentDate.getDay()

        if (!schedule.daysOfWeek || schedule.daysOfWeek.includes(dayOfWeek)) {
          instances.push({
            date: format(currentDate, 'yyyy-MM-dd'),
            dayOfWeek,
            timeSlots: schedule.timeSlots,
          })
        }

        switch (schedule.pattern) {
          case 'daily':
            currentDate = addDays(currentDate, 1)
            break
          case 'weekly':
            currentDate = addDays(currentDate, 7)
            break
          case 'biweekly':
            currentDate = addDays(currentDate, 14)
            break
          case 'monthly':
            currentDate = addDays(currentDate, 30)
            break
        }
      }

      return instances
    },
    []
  )

  const getScheduleForDate = useCallback(
    (date: Date): ScheduleInstance[] => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayOfWeek = date.getDay()

      return schedules
        .filter((schedule) => {
          const scheduleStart = parseISO(schedule.startDate)
          const scheduleEnd = schedule.endDate
            ? parseISO(schedule.endDate)
            : new Date('2099-12-31')

          return (
            date >= scheduleStart &&
            date <= scheduleEnd &&
            (!schedule.daysOfWeek || schedule.daysOfWeek.includes(dayOfWeek))
          )
        })
        .map((schedule) => ({
          date: dateStr,
          dayOfWeek,
          timeSlots: schedule.timeSlots,
        }))
    },
    [schedules]
  )

  return {
    schedules,
    addSchedule,
    removeSchedule,
    updateSchedule,
    generateInstances,
    getScheduleForDate,
  }
}
