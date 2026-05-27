import { useState, useCallback } from 'react'
import { QueueItem, QueueOptions } from './use-queue.types'
import { useQueueProcessor } from './use-queue-processor'

export type { QueueItem, QueueOptions } from './use-queue.types'

export function useQueue<T, R = void>(
  processor: (data: T) => Promise<R>,
  options: QueueOptions = {}
) {
  const {
    concurrency = 1,
    maxRetries = 3,
    retryDelay = 1000,
    autoStart = true
  } = options

  const [isRunning, setIsRunning] = useState(autoStart)

  const { queue, setQueue, processing, completed, setCompleted, failed, setFailed } =
    useQueueProcessor<T, R>(processor, { concurrency, maxRetries, retryDelay, isRunning })

  const enqueue = useCallback((data: T, priority: number = 0) => {
    const item: QueueItem<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data,
      priority,
      addedAt: Date.now(),
      status: 'pending',
      retries: 0
    }
    setQueue(prev => {
      const next = [...prev, item]
      next.sort((a, b) => (b.priority || 0) - (a.priority || 0))
      return next
    })
    return item.id
  }, [setQueue])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const clear = useCallback(() => setQueue([]), [setQueue])
  const clearCompleted = useCallback(() => setCompleted([]), [setCompleted])
  const clearFailed = useCallback(() => setFailed([]), [setFailed])
  const remove = useCallback(
    (id: string) => setQueue(prev => prev.filter(item => item.id !== id)),
    [setQueue]
  )

  const retryFailed = useCallback(() => {
    setFailed(prev => {
      const items = prev.map(item => ({
        ...item,
        status: 'pending' as const,
        retries: 0,
        error: undefined
      }))
      setQueue(q => {
        const next = [...q, ...items]
        next.sort((a, b) => (b.priority || 0) - (a.priority || 0))
        return next
      })
      return []
    })
  }, [setFailed, setQueue])

  return {
    queue,
    processing,
    completed,
    failed,
    isRunning,
    stats: {
      pending: queue.length,
      processing: processing.length,
      completed: completed.length,
      failed: failed.length,
      total: queue.length + processing.length + completed.length + failed.length
    },
    enqueue,
    start,
    pause,
    clear,
    clearCompleted,
    clearFailed,
    retryFailed,
    remove
  }
}
