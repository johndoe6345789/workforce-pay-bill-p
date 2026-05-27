export interface OptimisticUpdate<T> {
  id: string
  previousValue: T
  newValue: T
  timestamp: number
}

export interface ExecuteOptimisticOptions<R> {
  timeout?: number
  onSuccess?: (result: R) => void
  onError?: (error: Error) => void
}
