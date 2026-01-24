import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import type { Worker } from '@/lib/types'

export function useWorkersCrud() {
  const [workers, setWorkers] = useIndexedDBState<Worker[]>(STORES.WORKERS, [])

  const createWorker = useCallback(async (worker: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...worker,
      id: `worker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    
    try {
      await indexedDB.create(STORES.WORKERS, newWorker)
      setWorkers(current => [...current, newWorker])
      return newWorker
    } catch (error) {
      console.error('Failed to create worker:', error)
      throw error
    }
  }, [setWorkers])

  const updateWorker = useCallback(async (id: string, updates: Partial<Worker>) => {
    try {
      const existing = await indexedDB.read<Worker>(STORES.WORKERS, id)
      if (!existing) throw new Error('Worker not found')

      const updated = { ...existing, ...updates }
      await indexedDB.update(STORES.WORKERS, updated)
      
      setWorkers(current =>
        current.map(w => w.id === id ? updated : w)
      )
      return updated
    } catch (error) {
      console.error('Failed to update worker:', error)
      throw error
    }
  }, [setWorkers])

  const deleteWorker = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(STORES.WORKERS, id)
      setWorkers(current => current.filter(w => w.id !== id))
    } catch (error) {
      console.error('Failed to delete worker:', error)
      throw error
    }
  }, [setWorkers])

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
      const workers = await indexedDB.readByIndex<Worker>(STORES.WORKERS, 'email', email)
      return workers[0] || null
    } catch (error) {
      console.error('Failed to get worker by email:', error)
      throw error
    }
  }, [])

  const bulkCreateWorkers = useCallback(async (workersData: Omit<Worker, 'id'>[]) => {
    try {
      const newWorkers = workersData.map(data => ({
        ...data,
        id: `worker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))

      await indexedDB.bulkCreate(STORES.WORKERS, newWorkers)
      setWorkers(current => [...current, ...newWorkers])
      return newWorkers
    } catch (error) {
      console.error('Failed to bulk create workers:', error)
      throw error
    }
  }, [setWorkers])

  const bulkUpdateWorkers = useCallback(async (updates: { id: string; updates: Partial<Worker> }[]) => {
    try {
      const updatedWorkers = await Promise.all(
        updates.map(async ({ id, updates: data }) => {
          const existing = await indexedDB.read<Worker>(STORES.WORKERS, id)
          if (!existing) throw new Error(`Worker ${id} not found`)
          return { ...existing, ...data }
        })
      )

      await indexedDB.bulkUpdate(STORES.WORKERS, updatedWorkers)
      
      setWorkers(current =>
        current.map(w => {
          const updated = updatedWorkers.find(u => u.id === w.id)
          return updated || w
        })
      )
      
      return updatedWorkers
    } catch (error) {
      console.error('Failed to bulk update workers:', error)
      throw error
    }
  }, [setWorkers])

  return {
    workers,
    createWorker,
    updateWorker,
    deleteWorker,
    getWorkerById,
    getWorkersByStatus,
    getWorkerByEmail,
    bulkCreateWorkers,
    bulkUpdateWorkers
  }
}
