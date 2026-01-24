import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import type { Timesheet } from '@/lib/types'

export function useTimesheetsCrud() {
  const [timesheets, setTimesheets] = useIndexedDBState<Timesheet[]>(STORES.TIMESHEETS, [])

  const createTimesheet = useCallback(async (timesheet: Omit<Timesheet, 'id'>) => {
    const newTimesheet: Timesheet = {
      ...timesheet,
      id: `timesheet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    
    try {
      await indexedDB.create(STORES.TIMESHEETS, newTimesheet)
      setTimesheets(current => [...current, newTimesheet])
      return newTimesheet
    } catch (error) {
      console.error('Failed to create timesheet:', error)
      throw error
    }
  }, [setTimesheets])

  const updateTimesheet = useCallback(async (id: string, updates: Partial<Timesheet>) => {
    try {
      const existing = await indexedDB.read<Timesheet>(STORES.TIMESHEETS, id)
      if (!existing) throw new Error('Timesheet not found')

      const updated = { ...existing, ...updates }
      await indexedDB.update(STORES.TIMESHEETS, updated)
      
      setTimesheets(current =>
        current.map(t => t.id === id ? updated : t)
      )
      return updated
    } catch (error) {
      console.error('Failed to update timesheet:', error)
      throw error
    }
  }, [setTimesheets])

  const deleteTimesheet = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(STORES.TIMESHEETS, id)
      setTimesheets(current => current.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete timesheet:', error)
      throw error
    }
  }, [setTimesheets])

  const getTimesheetById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<Timesheet>(STORES.TIMESHEETS, id)
    } catch (error) {
      console.error('Failed to get timesheet:', error)
      throw error
    }
  }, [])

  const getTimesheetsByWorker = useCallback(async (workerId: string) => {
    try {
      return await indexedDB.readByIndex<Timesheet>(STORES.TIMESHEETS, 'workerId', workerId)
    } catch (error) {
      console.error('Failed to get timesheets by worker:', error)
      throw error
    }
  }, [])

  const getTimesheetsByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Timesheet>(STORES.TIMESHEETS, 'status', status)
    } catch (error) {
      console.error('Failed to get timesheets by status:', error)
      throw error
    }
  }, [])

  const bulkCreateTimesheets = useCallback(async (timesheetsData: Omit<Timesheet, 'id'>[]) => {
    try {
      const newTimesheets = timesheetsData.map(data => ({
        ...data,
        id: `timesheet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))

      await indexedDB.bulkCreate(STORES.TIMESHEETS, newTimesheets)
      setTimesheets(current => [...current, ...newTimesheets])
      return newTimesheets
    } catch (error) {
      console.error('Failed to bulk create timesheets:', error)
      throw error
    }
  }, [setTimesheets])

  const bulkUpdateTimesheets = useCallback(async (updates: { id: string; updates: Partial<Timesheet> }[]) => {
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
        current.map(t => {
          const updated = updatedTimesheets.find(u => u.id === t.id)
          return updated || t
        })
      )
      
      return updatedTimesheets
    } catch (error) {
      console.error('Failed to bulk update timesheets:', error)
      throw error
    }
  }, [setTimesheets])

  return {
    timesheets,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetById,
    getTimesheetsByWorker,
    getTimesheetsByStatus,
    bulkCreateTimesheets,
    bulkUpdateTimesheets
  }
}
