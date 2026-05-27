import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Timesheet } from '@/lib/types'

type SetTimesheets = (updater: (prev: Timesheet[]) => Timesheet[]) => void

export function useTimesheetsBulk(setTimesheets: SetTimesheets) {
  const bulkCreateTimesheets = useCallback(
    async (timesheetsData: Omit<Timesheet, 'id'>[]) => {
      try {
        const newTimesheets = timesheetsData.map(data => ({
          ...data,
          id: `timesheet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }))
        await indexedDB.bulkCreate(STORES.TIMESHEETS, newTimesheets)
        setTimesheets(current => [...current, ...newTimesheets])
        return newTimesheets
      } catch (error) {
        console.error('Failed to bulk create timesheets:', error)
        throw error
      }
    },
    [setTimesheets]
  )

  const bulkUpdateTimesheets = useCallback(
    async (updates: { id: string; updates: Partial<Timesheet> }[]) => {
      try {
        const updatedTimesheets = await Promise.all(
          updates.map(async ({ id, updates: data }) => {
            const existing = await indexedDB.read<Timesheet>(STORES.TIMESHEETS, id)
            if (!existing) throw new Error(`Timesheet ${id} not found`)
            return { ...existing, ...data }
          })
        )
        await indexedDB.bulkUpdate(STORES.TIMESHEETS, updatedTimesheets)
        setTimesheets(current =>
          current.map(t => updatedTimesheets.find(u => u.id === t.id) ?? t)
        )
        return updatedTimesheets
      } catch (error) {
        console.error('Failed to bulk update timesheets:', error)
        throw error
      }
    },
    [setTimesheets]
  )

  return { bulkCreateTimesheets, bulkUpdateTimesheets }
}
