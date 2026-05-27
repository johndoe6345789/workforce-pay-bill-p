import { useState, useCallback } from 'react'

export function useBulkSelection() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

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

  const isSelected = useCallback(
    (id: string) => selectedItems.has(id),
    [selectedItems]
  )

  const selectRange = useCallback(
    (startId: string, endId: string, allIds: string[]) => {
      const startIndex = allIds.indexOf(startId)
      const endIndex = allIds.indexOf(endId)
      if (startIndex === -1 || endIndex === -1) return

      const [start, end] =
        startIndex < endIndex
          ? [startIndex, endIndex]
          : [endIndex, startIndex]
      const rangeIds = allIds.slice(start, end + 1)

      setSelectedItems(prev => {
        const next = new Set(prev)
        rangeIds.forEach(id => next.add(id))
        return next
      })
    },
    []
  )

  return {
    selectedItems,
    setSelectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectRange,
  }
}
