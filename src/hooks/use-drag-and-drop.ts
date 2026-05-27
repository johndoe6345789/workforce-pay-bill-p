import { useState, useCallback, useRef } from 'react'
import type { DragItem, DropZone, DragState } from './use-drag-and-drop.types'
import { useDragHandlers } from './use-drag-handlers'

export type { DragItem, DropZone, DragState } from './use-drag-and-drop.types'

export function useDragAndDrop<T = unknown>() {
  const [dragState, setDragState] = useState<DragState<T>>({
    isDragging: false,
    draggedItem: null,
    draggedOver: null,
  })

  const dragImageRef = useRef<HTMLElement | null>(null)

  const startDrag = useCallback((item: DragItem<T>, event?: React.DragEvent) => {
    setDragState({ isDragging: true, draggedItem: item, draggedOver: null })
    if (event && dragImageRef.current) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
    }
  }, [])

  const endDrag = useCallback(() => {
    setDragState({ isDragging: false, draggedItem: null, draggedOver: null })
  }, [])

  const dragOver = useCallback((zoneId: string) => {
    setDragState(prev => ({ ...prev, draggedOver: zoneId }))
  }, [])

  const dragLeave = useCallback(() => {
    setDragState(prev => ({ ...prev, draggedOver: null }))
  }, [])

  const { canDrop, getDragHandlers, getDropHandlers } = useDragHandlers<T>({
    dragState,
    startDrag,
    endDrag,
    dragOver,
    dragLeave,
  })

  const setDragImage = useCallback((element: HTMLElement | null) => {
    dragImageRef.current = element
  }, [])

  const reset = useCallback(() => { endDrag() }, [endDrag])

  return {
    ...dragState,
    getDragHandlers,
    getDropHandlers,
    setDragImage,
    canDrop,
    reset,
  }
}
