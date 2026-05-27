import { useCallback, useState, useEffect } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBLive } from './use-indexed-db-live'
import { useTimesheetsWrite } from './use-timesheets-write'
import { useTimesheetsBulk } from './use-timesheets-bulk'
import type { Timesheet } from '@/lib/types'

export function useTimesheetsCrud(options?: {
  liveRefresh?: boolean
  pollingInterval?: number
}) {
  const liveRefreshEnabled = options?.liveRefresh !== false
  const pollingInterval = options?.pollingInterval ?? 1000
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const [timesheets, setTimesheets] = useIndexedDBLive<Timesheet[]>(
    STORES.TIMESHEETS,
    [],
    { enabled: liveRefreshEnabled, pollingInterval }
  )

  useEffect(() => { setLastUpdated(new Date()) }, [timesheets])

  const { createTimesheet, updateTimesheet, deleteTimesheet } =
    useTimesheetsWrite(setTimesheets)
  const { bulkCreateTimesheets, bulkUpdateTimesheets } =
    useTimesheetsBulk(setTimesheets)

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
      return await indexedDB.readByIndex<Timesheet>(
        STORES.TIMESHEETS, 'workerId', workerId
      )
    } catch (error) {
      console.error('Failed to get timesheets by worker:', error)
      throw error
    }
  }, [])

  const getTimesheetsByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Timesheet>(
        STORES.TIMESHEETS, 'status', status
      )
    } catch (error) {
      console.error('Failed to get timesheets by status:', error)
      throw error
    }
  }, [])

  return {
    timesheets,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetById,
    getTimesheetsByWorker,
    getTimesheetsByStatus,
    bulkCreateTimesheets,
    bulkUpdateTimesheets,
    lastUpdated,
  }
}
