import { useState, useCallback } from 'react'

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)))
  }, [items])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id)
  }, [selectedIds])

  const selectedItems = items.filter(item => selectedIds.has(item.id))

  return {
    selectedIds,
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    hasSelection: selectedIds.size > 0,
    selectionCount: selectedIds.size
  }
}
