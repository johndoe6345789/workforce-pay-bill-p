export interface DragItem<T = unknown> {
  id: string
  data: T
  type?: string
}

export interface DropZone {
  id: string
  accepts?: string[]
}

export interface DragState<T = unknown> {
  isDragging: boolean
  draggedItem: DragItem<T> | null
  draggedOver: string | null
}
