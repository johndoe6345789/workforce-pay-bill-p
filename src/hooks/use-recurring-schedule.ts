import { useState } from 'react'
import type { RecurringSchedule, ScheduleInstance } from './use-recurring-schedule.types'
import { useRecurringScheduleCrud } from './use-recurring-schedule-crud'
import { useRecurringScheduleInstances } from './use-recurring-schedule-instances'

export type { RecurringSchedule, ScheduleInstance } from './use-recurring-schedule.types'

export function useRecurringSchedule() {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([])

  const { addSchedule, removeSchedule, updateSchedule } =
    useRecurringScheduleCrud(setSchedules)

  const { generateInstances, getScheduleForDate } =
    useRecurringScheduleInstances(schedules)

  return {
    schedules,
    addSchedule,
    removeSchedule,
    updateSchedule,
    generateInstances,
    getScheduleForDate,
  }
}
