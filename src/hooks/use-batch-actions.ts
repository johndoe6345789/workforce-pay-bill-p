import { useState, useCallback } from 'react'

export function useBatchActions<T extends { id: string }>() {
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

  const selectAll = useCallback((items: T[]) => {
    setSelectedIds(new Set(items.map(item => item.id)))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id)
  }, [selectedIds])

  const toggleAll = useCallback((items: T[]) => {
    if (selectedIds.size === items.length) {
      clearSelection()
    } else {
      selectAll(items)
    }
  }, [selectedIds.size, selectAll, clearSelection])

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    toggleAll,
    hasSelection: selectedIds.size > 0
  }
}
