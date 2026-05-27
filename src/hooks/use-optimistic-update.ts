import { useState, useCallback } from 'react'
import type { OptimisticUpdate, ExecuteOptimisticOptions } from './use-optimistic-update.types'
import { useOptimisticTimers } from './use-optimistic-timers'

export type { OptimisticUpdate, ExecuteOptimisticOptions } from './use-optimistic-update.types'

export function useOptimisticUpdate<T>() {
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map())
  const { setTimer, clearTimer, clearAllTimers } = useOptimisticTimers()

  const applyOptimistic = useCallback((id: string, previousValue: T, newValue: T) => {
    setPendingUpdates(prev => {
      const next = new Map(prev)
      next.set(id, { id, previousValue, newValue, timestamp: Date.now() })
      return next
    })
  }, [])

  const commitUpdate = useCallback((id: string) => {
    setPendingUpdates(prev => { const next = new Map(prev); next.delete(id); return next })
    clearTimer(id)
  }, [clearTimer])

  const rollbackUpdate = useCallback((id: string) => {
    const update = pendingUpdates.get(id)
    if (!update) return null
    setPendingUpdates(prev => { const next = new Map(prev); next.delete(id); return next })
    clearTimer(id)
    return update.previousValue
  }, [pendingUpdates, clearTimer])

  const executeOptimistic = useCallback(async <R = void>(
    id: string,
    previousValue: T,
    newValue: T,
    operation: () => Promise<R>,
    options: ExecuteOptimisticOptions<R> = {},
  ): Promise<R | null> => {
    const { timeout = 30000, onSuccess, onError } = options
    applyOptimistic(id, previousValue, newValue)
    setTimer(id, () => { rollbackUpdate(id); onError?.(new Error('Operation timed out')) }, timeout)
    try {
      const result = await operation()
      clearTimer(id)
      commitUpdate(id)
      onSuccess?.(result)
      return result
    } catch (error) {
      clearTimer(id)
      rollbackUpdate(id)
      onError?.(error as Error)
      return null
    }
  }, [applyOptimistic, commitUpdate, rollbackUpdate, setTimer, clearTimer])

  const getOptimisticValue = useCallback((id: string, currentValue: T): T => {
    const update = pendingUpdates.get(id)
    return update ? update.newValue : currentValue
  }, [pendingUpdates])

  const hasPendingUpdate = useCallback((id: string): boolean => {
    return pendingUpdates.has(id)
  }, [pendingUpdates])

  const clearAll = useCallback(() => {
    clearAllTimers()
    setPendingUpdates(new Map())
  }, [clearAllTimers])

  return {
    applyOptimistic,
    commitUpdate,
    rollbackUpdate,
    executeOptimistic,
    getOptimisticValue,
    hasPendingUpdate,
    pendingCount: pendingUpdates.size,
    clearAll,
  }
}
