import { useState, useCallback } from 'react'

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  width?: number
  order: number
}

export function useColumnVisibility(initialColumns: ColumnConfig[]) {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)

  const toggleColumn = useCallback((id: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    )
  }, [])

  const showAll = useCallback(() => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })))
  }, [])

  const hideAll = useCallback(() => {
    setColumns(prev => prev.map(col => ({ ...col, visible: false })))
  }, [])

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setColumns(prev => {
      const newColumns = [...prev]
      const [removed] = newColumns.splice(fromIndex, 1)
      newColumns.splice(toIndex, 0, removed)
      return newColumns.map((col, index) => ({ ...col, order: index }))
    })
  }, [])

  const resizeColumn = useCallback((id: string, width: number) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === id ? { ...col, width } : col
      )
    )
  }, [])

  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order)

  return {
    columns,
    visibleColumns,
    toggleColumn,
    showAll,
    hideAll,
    reorderColumns,
    resizeColumn
  }
}
