import { useState, useCallback } from 'react'

export interface UseUndoReturn<T> {
  state: T
  set: (newState: T | ((prev: T) => T)) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  clear: () => void
  reset: () => void
}

export function useUndo<T>(initialState: T, maxHistory = 50): UseUndoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const state = history[currentIndex]

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev[currentIndex])
        : newState

      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push(nextState)

      if (newHistory.length > maxHistory) {
        newHistory.shift()
        setCurrentIndex(maxHistory - 1)
      } else {
        setCurrentIndex(newHistory.length - 1)
      }

      return newHistory
    })
  }, [currentIndex, maxHistory])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, history.length])

  const clear = useCallback(() => {
    setHistory([state])
    setCurrentIndex(0)
  }, [state])

  const reset = useCallback(() => {
    setHistory([initialState])
    setCurrentIndex(0)
  }, [initialState])

  return {
    state,
    set,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clear,
    reset
  }
}
