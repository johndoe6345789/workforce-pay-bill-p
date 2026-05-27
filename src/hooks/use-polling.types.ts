export interface PollingOptions<T> {
  interval: number
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  maxRetries?: number
  backoffMultiplier?: number
  shouldRetry?: (error: Error, retryCount: number) => boolean
}
