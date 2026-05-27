import { useState, useCallback } from 'react'
import type {
  BulkOperationOptions,
  BulkOperationError,
  BulkOperationResult,
} from './use-bulk-operations.types'

export function useBulkProcessor(selectedItems: Set<string>) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<BulkOperationError[]>([])
  const [results, setResults] = useState<BulkOperationResult[]>([])

  const processBulk = useCallback(
    async <R = unknown>(
      operation: (id: string) => Promise<R>,
      options: BulkOperationOptions = {}
    ): Promise<void> => {
      const {
        batchSize = 5,
        delayBetweenBatches = 100,
        continueOnError = true,
      } = options

      setIsProcessing(true)
      setProgress(0)
      setErrors([])
      setResults([])

      const itemIds = Array.from(selectedItems)
      const totalItems = itemIds.length
      let processed = 0
      const newErrors: BulkOperationError[] = []
      const newResults: BulkOperationResult[] = []

      for (let i = 0; i < itemIds.length; i += batchSize) {
        const batch = itemIds.slice(i, i + batchSize)

        const batchPromises = batch.map(async id => {
          try {
            const result = await operation(id)
            newResults.push({ id, success: true, data: result as unknown })
            return { id, success: true }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error'
            newErrors.push({ id, error: errorMessage })
            newResults.push({ id, success: false })
            if (!continueOnError) throw error
            return { id, success: false }
          }
        })

        try {
          await Promise.all(batchPromises)
        } catch (error) {
          if (!continueOnError) {
            setIsProcessing(false)
            setErrors(newErrors)
            setResults(newResults)
            throw error
          }
        }

        processed += batch.length
        setProgress(Math.round((processed / totalItems) * 100))
        setErrors([...newErrors])
        setResults([...newResults])

        if (i + batchSize < itemIds.length && delayBetweenBatches > 0) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
        }
      }

      setIsProcessing(false)
      setProgress(100)
    },
    [selectedItems]
  )

  const resetProcessor = useCallback(() => {
    setIsProcessing(false)
    setProgress(0)
    setErrors([])
    setResults([])
  }, [])

  return { isProcessing, progress, errors, results, processBulk, resetProcessor }
}
