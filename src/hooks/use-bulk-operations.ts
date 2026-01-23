import { useState, useCallback } from 'react'

export interface BulkOperationState<T> {
  selectedItems: Set<string>
  isProcessing: boolean
  progress: number
  errors: Array<{ id: string; error: string }>
  results: Array<{ id: string; success: boolean; data?: any }>
}

export interface BulkOperationOptions {
  batchSize?: number
  delayBetweenBatches?: number
  continueOnError?: boolean
}

export function useBulkOperations<T = any>() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<Array<{ id: string; error: string }>>([])
  const [results, setResults] = useState<Array<{ id: string; success: boolean; data?: any }>>([])

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedItems(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
  }, [])

  const isSelected = useCallback((id: string) => {
    return selectedItems.has(id)
  }, [selectedItems])

  const selectRange = useCallback((startId: string, endId: string, allIds: string[]) => {
    const startIndex = allIds.indexOf(startId)
    const endIndex = allIds.indexOf(endId)
    if (startIndex === -1 || endIndex === -1) return

    const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex]
    const rangeIds = allIds.slice(start, end + 1)
    
    setSelectedItems(prev => {
      const next = new Set(prev)
      rangeIds.forEach(id => next.add(id))
      return next
    })
  }, [])

  const processBulk = useCallback(async <R = any>(
    operation: (id: string) => Promise<R>,
    options: BulkOperationOptions = {}
  ): Promise<void> => {
    const {
      batchSize = 5,
      delayBetweenBatches = 100,
      continueOnError = true
    } = options

    setIsProcessing(true)
    setProgress(0)
    setErrors([])
    setResults([])

    const itemIds = Array.from(selectedItems)
    const totalItems = itemIds.length
    let processed = 0
    const newErrors: Array<{ id: string; error: string }> = []
    const newResults: Array<{ id: string; success: boolean; data?: any }> = []

    for (let i = 0; i < itemIds.length; i += batchSize) {
      const batch = itemIds.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (id) => {
        try {
          const result = await operation(id)
          newResults.push({ id, success: true, data: result })
          return { id, success: true }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          newErrors.push({ id, error: errorMessage })
          newResults.push({ id, success: false })
          if (!continueOnError) {
            throw error
          }
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
  }, [selectedItems])

  const reset = useCallback(() => {
    setSelectedItems(new Set())
    setIsProcessing(false)
    setProgress(0)
    setErrors([])
    setResults([])
  }, [])

  return {
    selectedItems: Array.from(selectedItems),
    selectedCount: selectedItems.size,
    isProcessing,
    progress,
    errors,
    results,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectRange,
    processBulk,
    reset
  }
}
