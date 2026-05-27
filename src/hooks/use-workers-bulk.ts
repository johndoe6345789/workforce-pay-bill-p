import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Worker } from '@/lib/types'

type SetWorkers = (updater: (prev: Worker[]) => Worker[]) => void

export function useWorkersBulk(setWorkers: SetWorkers) {
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

  return { bulkCreateWorkers, bulkUpdateWorkers }
}
