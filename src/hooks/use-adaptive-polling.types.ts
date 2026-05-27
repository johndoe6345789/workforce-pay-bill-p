export interface AdaptivePollingOptions<T> {
  fetcher: () => Promise<T>
  baseInterval: number
  maxInterval?: number
  minInterval?: number
  backoffMultiplier?: number
  errorThreshold?: number
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export interface AdaptivePollingResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  currentInterval: number
  consecutiveErrors: number
  refetch: () => Promise<void>
  reset: () => void
}
