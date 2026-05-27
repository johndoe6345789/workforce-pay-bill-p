import { useCallback } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import type { RecurringSchedule, ScheduleInstance } from './use-recurring-schedule.types'

export function useRecurringScheduleInstances(
  schedules: RecurringSchedule[]
) {
  const generateInstances = useCallback(
    (
      schedule: RecurringSchedule,
      startDate: Date,
      endDate: Date
    ): ScheduleInstance[] => {
      const instances: ScheduleInstance[] = []
      const scheduleStart = parseISO(schedule.startDate)
      const scheduleEnd = schedule.endDate
        ? parseISO(schedule.endDate)
        : endDate

      let currentDate =
        scheduleStart > startDate ? scheduleStart : startDate

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

  return { generateInstances, getScheduleForDate }
}
