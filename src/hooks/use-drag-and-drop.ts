import { useState, useCallback, useRef } from 'react'

export interface DragItem<T = any> {
  id: string
  data: T
  type?: string
}

export interface DropZone {
  id: string
  accepts?: string[]
}

export interface DragState<T = any> {
  isDragging: boolean
  draggedItem: DragItem<T> | null
  draggedOver: string | null
}

export function useDragAndDrop<T = any>() {
  const [dragState, setDragState] = useState<DragState<T>>({
    isDragging: false,
    draggedItem: null,
    draggedOver: null
  })

  const dragImageRef = useRef<HTMLElement | null>(null)

  const startDrag = useCallback((item: DragItem<T>, event?: React.DragEvent) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      draggedOver: null
    })

    if (event && dragImageRef.current) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
    }
  }, [])

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      draggedOver: null
    })
  }, [])

  const dragOver = useCallback((zoneId: string) => {
    setDragState(prev => ({
      ...prev,
      draggedOver: zoneId
    }))
  }, [])

  const dragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      draggedOver: null
    }))
  }, [])

  const canDrop = useCallback((zone: DropZone): boolean => {
    if (!dragState.draggedItem) return false
    if (!zone.accepts || zone.accepts.length === 0) return true
    
    return zone.accepts.includes(dragState.draggedItem.type || '')
  }, [dragState.draggedItem])

  const getDragHandlers = useCallback((item: DragItem<T>) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      startDrag(item, e)
    },
    onDragEnd: () => {
      endDrag()
    }
  }), [startDrag, endDrag])

  const getDropHandlers = useCallback((zone: DropZone, onDrop: (item: DragItem<T>) => void) => ({
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
    }
  }), [dragState.draggedItem, canDrop, dragOver, dragLeave, endDrag])

  const setDragImage = useCallback((element: HTMLElement | null) => {
    dragImageRef.current = element
  }, [])

  const reset = useCallback(() => {
    endDrag()
  }, [endDrag])

  return {
    ...dragState,
    getDragHandlers,
    getDropHandlers,
    setDragImage,
    canDrop,
    reset
  }
}
