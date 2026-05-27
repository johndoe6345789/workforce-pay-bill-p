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
