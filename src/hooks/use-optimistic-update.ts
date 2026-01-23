import { useState, useCallback, useRef } from 'react'

interface OptimisticUpdate<T> {
  id: string
  previousValue: T
  newValue: T
  timestamp: number
}

export function useOptimisticUpdate<T>() {
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map())
  const rollbackTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const applyOptimistic = useCallback((id: string, previousValue: T, newValue: T) => {
    setPendingUpdates(prev => {
      const next = new Map(prev)
      next.set(id, {
        id,
        previousValue,
        newValue,
        timestamp: Date.now()
      })
      return next
    })
  }, [])

  const commitUpdate = useCallback((id: string) => {
    setPendingUpdates(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
    
    const timer = rollbackTimers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      rollbackTimers.current.delete(id)
    }
  }, [])

  const rollbackUpdate = useCallback((id: string) => {
    const update = pendingUpdates.get(id)
    if (!update) return null

    setPendingUpdates(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })

    const timer = rollbackTimers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      rollbackTimers.current.delete(id)
    }

    return update.previousValue
  }, [pendingUpdates])

  const executeOptimistic = useCallback(async <R = void>(
    id: string,
    previousValue: T,
    newValue: T,
    operation: () => Promise<R>,
    options: { timeout?: number; onSuccess?: (result: R) => void; onError?: (error: Error) => void } = {}
  ): Promise<R | null> => {
    const { timeout = 30000, onSuccess, onError } = options

    applyOptimistic(id, previousValue, newValue)

    const timeoutTimer = setTimeout(() => {
      rollbackUpdate(id)
      onError?.(new Error('Operation timed out'))
    }, timeout)

    rollbackTimers.current.set(id, timeoutTimer)

    try {
      const result = await operation()
      clearTimeout(timeoutTimer)
      commitUpdate(id)
      onSuccess?.(result)
      return result
    } catch (error) {
      clearTimeout(timeoutTimer)
      rollbackUpdate(id)
      onError?.(error as Error)
      return null
    }
  }, [applyOptimistic, commitUpdate, rollbackUpdate])

  const getOptimisticValue = useCallback((id: string, currentValue: T): T => {
    const update = pendingUpdates.get(id)
    return update ? update.newValue : currentValue
  }, [pendingUpdates])

  const hasPendingUpdate = useCallback((id: string): boolean => {
    return pendingUpdates.has(id)
  }, [pendingUpdates])

  const clearAll = useCallback(() => {
    rollbackTimers.current.forEach(timer => clearTimeout(timer))
    rollbackTimers.current.clear()
    setPendingUpdates(new Map())
  }, [])

  return {
    applyOptimistic,
    commitUpdate,
    rollbackUpdate,
    executeOptimistic,
    getOptimisticValue,
    hasPendingUpdate,
    pendingCount: pendingUpdates.size,
    clearAll
  }
}
