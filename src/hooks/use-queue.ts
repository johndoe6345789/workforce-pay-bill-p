import { useState, useCallback, useRef, useEffect } from 'react'

export interface QueueItem<T> {
  id: string
  data: T
  priority?: number
  addedAt: number
  startedAt?: number
  completedAt?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: Error
  retries: number
}

export interface QueueOptions {
  concurrency?: number
  maxRetries?: number
  retryDelay?: number
  autoStart?: boolean
}

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

  const [queue, setQueue] = useState<QueueItem<T>[]>([])
  const [processing, setProcessing] = useState<QueueItem<T>[]>([])
  const [completed, setCompleted] = useState<QueueItem<T>[]>([])
  const [failed, setFailed] = useState<QueueItem<T>[]>([])
  const [isRunning, setIsRunning] = useState(autoStart)

  const processingRef = useRef<Set<string>>(new Set())
  const mountedRef = useRef(true)

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
  }, [])

  const processItem = useCallback(async (item: QueueItem<T>) => {
    if (!mountedRef.current) return

    processingRef.current.add(item.id)
    
    setQueue(prev => prev.filter(i => i.id !== item.id))
    setProcessing(prev => [...prev, { ...item, status: 'processing', startedAt: Date.now() }])

    try {
      await processor(item.data)

      if (!mountedRef.current) return

      const completedItem = { ...item, status: 'completed' as const, completedAt: Date.now() }
      
      setProcessing(prev => prev.filter(i => i.id !== item.id))
      setCompleted(prev => [...prev, completedItem])
    } catch (error) {
      if (!mountedRef.current) return

      const err = error instanceof Error ? error : new Error('Processing failed')
      
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

      const nextItem = prev[0]
      processItem(nextItem)
      
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
    return () => {
      mountedRef.current = false
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const clear = useCallback(() => {
    setQueue([])
  }, [])

  const clearCompleted = useCallback(() => {
    setCompleted([])
  }, [])

  const clearFailed = useCallback(() => {
    setFailed([])
  }, [])

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
  }, [])

  const remove = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }, [])

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
