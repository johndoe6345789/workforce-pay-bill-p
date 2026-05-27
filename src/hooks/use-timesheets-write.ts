import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Timesheet } from '@/lib/types'

type SetTimesheets = (updater: (prev: Timesheet[]) => Timesheet[]) => void

export function useTimesheetsWrite(setTimesheets: SetTimesheets) {
  const createTimesheet = useCallback(
    async (timesheet: Omit<Timesheet, 'id'>) => {
      const newTimesheet: Timesheet = {
        ...timesheet,
        id: `timesheet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
      try {
        await indexedDB.create(STORES.TIMESHEETS, newTimesheet)
        setTimesheets(current => [...current, newTimesheet])
        return newTimesheet
      } catch (error) {
        console.error('Failed to create timesheet:', error)
        throw error
      }
    },
    [setTimesheets]
  )

  const updateTimesheet = useCallback(
    async (id: string, updates: Partial<Timesheet>) => {
      try {
        const existing = await indexedDB.read<Timesheet>(STORES.TIMESHEETS, id)
        if (!existing) throw new Error('Timesheet not found')
        const updated = { ...existing, ...updates }
        await indexedDB.update(STORES.TIMESHEETS, updated)
        setTimesheets(current => current.map(t => (t.id === id ? updated : t)))
        return updated
      } catch (error) {
        console.error('Failed to update timesheet:', error)
        throw error
      }
    },
    [setTimesheets]
  )

  const deleteTimesheet = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(STORES.TIMESHEETS, id)
        setTimesheets(current => current.filter(t => t.id !== id))
      } catch (error) {
        console.error('Failed to delete timesheet:', error)
        throw error
      }
    },
    [setTimesheets]
  )

  return { createTimesheet, updateTimesheet, deleteTimesheet }
}
