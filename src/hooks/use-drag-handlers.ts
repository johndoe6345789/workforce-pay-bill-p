import { useCallback } from 'react'
import type { DragItem, DropZone, DragState } from './use-drag-and-drop.types'

interface DragHandlersParams<T> {
  dragState: DragState<T>
  startDrag: (item: DragItem<T>, event?: React.DragEvent) => void
  endDrag: () => void
  dragOver: (zoneId: string) => void
  dragLeave: () => void
}

export function useDragHandlers<T = unknown>({
  dragState,
  startDrag,
  endDrag,
  dragOver,
  dragLeave,
}: DragHandlersParams<T>) {
  const canDrop = useCallback(
    (zone: DropZone): boolean => {
      if (!dragState.draggedItem) return false
      if (!zone.accepts || zone.accepts.length === 0) return true
      return zone.accepts.includes(dragState.draggedItem.type || '')
    },
    [dragState.draggedItem],
  )

  const getDragHandlers = useCallback(
    (item: DragItem<T>) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move'
        startDrag(item, e)
      },
      onDragEnd: () => {
        endDrag()
      },
    }),
    [startDrag, endDrag],
  )

  const getDropHandlers = useCallback(
    (zone: DropZone, onDrop: (item: DragItem<T>) => void) => ({
      onDragOver: (e: React.DragEvent) => {
        if (canDrop(zone)) {
          e.preventDefault()
          dragOver(zone.id)
        }
      },
      onDragEnter: (e: React.DragEvent) => {
        if (canDrop(zone)) {
          e.preventDefault()
          dragOver(zone.id)
        }
      },
      onDragLeave: () => {
        dragLeave()
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragState.draggedItem && canDrop(zone)) {
          onDrop(dragState.draggedItem)
        }
        endDrag()
      },
    }),
    [dragState.draggedItem, canDrop, dragOver, dragLeave, endDrag],
  )

  return { canDrop, getDragHandlers, getDropHandlers }
}
