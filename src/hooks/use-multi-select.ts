import { useState, useCallback } from 'react'

export function useMultiSelect<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
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

  const selectRange = useCallback((fromId: string, toId: string) => {
    const fromIndex = items.findIndex(item => item.id === fromId)
    const toIndex = items.findIndex(item => item.id === toId)
    
    if (fromIndex === -1 || toIndex === -1) return

    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    
    setSelectedIds(prev => {
      const next = new Set(prev)
      for (let i = start; i <= end; i++) {
        next.add(items[i].id)
      }
      return next
    })
  }, [items])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)))
  }, [items])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id)
  }, [selectedIds])

  const getSelectedItems = useCallback(() => {
    return items.filter(item => selectedIds.has(item.id))
  }, [items, selectedIds])

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggle,
    selectRange,
    selectAll,
    deselectAll,
    isSelected,
    getSelectedItems,
    isAllSelected: selectedIds.size === items.length && items.length > 0
  }
}
