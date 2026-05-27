import { useState, useCallback, useRef, useEffect } from 'react'
import { QueueItem } from './use-queue.types'

interface UseQueueProcessorOptions {
  concurrency: number
  maxRetries: number
  retryDelay: number
  isRunning: boolean
}

export function useQueueProcessor<T, R = void>(
  processor: (data: T) => Promise<R>,
  options: UseQueueProcessorOptions
) {
  const { concurrency, maxRetries, retryDelay, isRunning } = options

  const [queue, setQueue] = useState<QueueItem<T>[]>([])
  const [processing, setProcessing] = useState<QueueItem<T>[]>([])
  const [completed, setCompleted] = useState<QueueItem<T>[]>([])
  const [failed, setFailed] = useState<QueueItem<T>[]>([])

  const processingRef = useRef<Set<string>>(new Set())
  const mountedRef = useRef(true)

  const processItem = useCallback(async (item: QueueItem<T>) => {
    if (!mountedRef.current) return

    processingRef.current.add(item.id)
    setQueue(prev => prev.filter(i => i.id !== item.id))
    setProcessing(prev => [...prev, { ...item, status: 'processing', startedAt: Date.now() }])
    try {
      await processor(item.data)
      if (!mountedRef.current) return
      const completedItem = {
        ...item,
        status: 'completed' as const,
        completedAt: Date.now()
      }
      setProcessing(prev => prev.filter(i => i.id !== item.id))
      setCompleted(prev => [...prev, completedItem])
    } catch (error) {
      if (!mountedRef.current) return
      const err =
        error instanceof Error ? error : new Error('Processing failed')
      if (item.retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        if (!mountedRef.current) return
        const retryItem = { ...item, retries: item.retries + 1 }
        setProcessing(prev => prev.filter(i => i.id !== item.id))
        setQueue(prev => {
          const next = [...prev, retryItem]
          next.sort((a, b) => (b.priority || 0) - (a.priority || 0))
          return next
        })
      } else {
        const failedItem = {
          ...item,
          status: 'failed' as const,
          completedAt: Date.now(),
          error: err
        }
        setProcessing(prev => prev.filter(i => i.id !== item.id))
        setFailed(prev => [...prev, failedItem])
      }
    } finally {
      processingRef.current.delete(item.id)
    }
  }, [processor, maxRetries, retryDelay])

  const processNext = useCallback(async () => {
    if (!isRunning || processingRef.current.size >= concurrency) return
    setQueue(prev => {
      if (prev.length === 0) return prev
      processItem(prev[0])
      return prev
    })
  }, [isRunning, concurrency, processItem])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      if (processingRef.current.size < concurrency && queue.length > 0) {
        processNext()
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isRunning, concurrency, queue.length, processNext])

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  return { queue, setQueue, processing, completed, setCompleted, failed, setFailed }
}
