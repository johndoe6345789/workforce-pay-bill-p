import { useCallback } from 'react'
import { useBulkSelection } from './use-bulk-selection'
import { useBulkProcessor } from './use-bulk-processor'

export type { BulkOperationState, BulkOperationOptions } from './use-bulk-operations.types'

export function useBulkOperations<T = unknown>() {
  const {
    selectedItems,
    setSelectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectRange,
  } = useBulkSelection()

  const {
    isProcessing,
    progress,
    errors,
    results,
    processBulk,
    resetProcessor,
  } = useBulkProcessor(selectedItems)

  const reset = useCallback(() => {
    setSelectedItems(new Set())
    resetProcessor()
  }, [setSelectedItems, resetProcessor])

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
    reset,
  }
}
