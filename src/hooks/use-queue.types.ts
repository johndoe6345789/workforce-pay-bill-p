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
