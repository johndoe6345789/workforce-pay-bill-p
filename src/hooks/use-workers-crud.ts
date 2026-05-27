import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import { useWorkersWrite } from './use-workers-write'
import type { Worker } from '@/lib/types'

export function useWorkersCrud() {
  const [workers, setWorkers] = useIndexedDBState<Worker[]>(STORES.WORKERS, [])

  const {
    createWorker,
    updateWorker,
    deleteWorker,
    bulkCreateWorkers,
    bulkUpdateWorkers,
  } = useWorkersWrite(setWorkers)

  const getWorkerById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<Worker>(STORES.WORKERS, id)
    } catch (error) {
      console.error('Failed to get worker:', error)
      throw error
    }
  }, [])

  const getWorkersByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Worker>(STORES.WORKERS, 'status', status)
    } catch (error) {
      console.error('Failed to get workers by status:', error)
      throw error
    }
  }, [])

  const getWorkerByEmail = useCallback(async (email: string) => {
    try {
      const results = await indexedDB.readByIndex<Worker>(
        STORES.WORKERS,
        'email',
        email
      )
      return results[0] ?? null
    } catch (error) {
      console.error('Failed to get worker by email:', error)
      throw error
    }
  }, [])

  return {
    workers,
    createWorker,
    updateWorker,
    deleteWorker,
    getWorkerById,
    getWorkersByStatus,
    getWorkerByEmail,
    bulkCreateWorkers,
    bulkUpdateWorkers,
  }
}
