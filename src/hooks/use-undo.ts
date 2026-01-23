import { useState, useCallback } from 'react'

export function useUndo<T>(initialState: T, maxHistory = 50) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const current = history[currentIndex]
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prevHistory => {
      const currentState = prevHistory[currentIndex]
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(currentState)
        : newState

      const newHistory = prevHistory.slice(0, currentIndex + 1)
      newHistory.push(nextState)

      if (newHistory.length > maxHistory) {
        newHistory.shift()
        setCurrentIndex(currentIndex)
      } else {
        setCurrentIndex(currentIndex + 1)
      }

      return newHistory
    })
  }, [currentIndex, maxHistory])

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [canUndo])

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [canRedo])

  const reset = useCallback(() => {
    setHistory([initialState])
    setCurrentIndex(0)
  }, [initialState])

  const clear = useCallback(() => {
    setHistory([current])
    setCurrentIndex(0)
  }, [current])

  return {
    state: current,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    clear,
    history: history.length,
    currentIndex
  }
}
