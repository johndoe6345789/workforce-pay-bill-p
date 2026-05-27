import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Worker } from '@/lib/types'

type SetWorkers = (updater: (prev: Worker[]) => Worker[]) => void

export function useWorkersWrite(setWorkers: SetWorkers) {
  const createWorker = useCallback(
    async (worker: Omit<Worker, 'id'>) => {
      const newWorker: Worker = {
        ...worker,
        id: `worker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
      try {
        await indexedDB.create(STORES.WORKERS, newWorker)
        setWorkers(current => [...current, newWorker])
        return newWorker
      } catch (error) {
        console.error('Failed to create worker:', error)
        throw error
      }
    },
    [setWorkers]
  )

  const updateWorker = useCallback(
    async (id: string, updates: Partial<Worker>) => {
      try {
        const existing = await indexedDB.read<Worker>(STORES.WORKERS, id)
        if (!existing) throw new Error('Worker not found')
        const updated = { ...existing, ...updates }
        await indexedDB.update(STORES.WORKERS, updated)
        setWorkers(current => current.map(w => (w.id === id ? updated : w)))
        return updated
      } catch (error) {
        console.error('Failed to update worker:', error)
        throw error
      }
    },
    [setWorkers]
  )

  const deleteWorker = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(STORES.WORKERS, id)
        setWorkers(current => current.filter(w => w.id !== id))
      } catch (error) {
        console.error('Failed to delete worker:', error)
        throw error
      }
    },
    [setWorkers]
  )

  const bulkCreateWorkers = useCallback(
    async (workersData: Omit<Worker, 'id'>[]) => {
      try {
        const newWorkers = workersData.map(data => ({
          ...data,
          id: `worker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }))
        await indexedDB.bulkCreate(STORES.WORKERS, newWorkers)
        setWorkers(current => [...current, ...newWorkers])
        return newWorkers
      } catch (error) {
        console.error('Failed to bulk create workers:', error)
        throw error
      }
    },
    [setWorkers]
  )

  const bulkUpdateWorkers = useCallback(
    async (updates: { id: string; updates: Partial<Worker> }[]) => {
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
          current.map(w => updatedWorkers.find(u => u.id === w.id) ?? w)
        )
        return updatedWorkers
      } catch (error) {
        console.error('Failed to bulk update workers:', error)
        throw error
      }
    },
    [setWorkers]
  )

  return {
    createWorker,
    updateWorker,
    deleteWorker,
    bulkCreateWorkers,
    bulkUpdateWorkers,
  }
}
