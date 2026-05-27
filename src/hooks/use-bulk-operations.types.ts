export interface BulkOperationResult {
  id: string
  success: boolean
  data?: unknown
}

export interface BulkOperationError {
  id: string
  error: string
}

export interface BulkOperationState {
  selectedItems: Set<string>
  isProcessing: boolean
  progress: number
  errors: BulkOperationError[]
  results: BulkOperationResult[]
}

export interface BulkOperationOptions {
  batchSize?: number
  delayBetweenBatches?: number
  continueOnError?: boolean
}
