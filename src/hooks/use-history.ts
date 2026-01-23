import { useState, useCallback, useEffect } from 'react'

export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export interface UseHistoryReturn<T> {
  state: T
  setState: (newState: T | ((prev: T) => T)) => void
  undo: () => void
  redo: () => void
  clear: () => void
  canUndo: boolean
  canRedo: boolean
  history: HistoryState<T>
}

export function useHistory<T>(initialState: T, maxHistory = 50): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  })

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setHistory((current) => {
        const next = typeof newState === 'function' 
          ? (newState as (prev: T) => T)(current.present)
          : newState

        if (next === current.present) return current

        return {
          past: [...current.past, current.present].slice(-maxHistory),
          present: next,
          future: [],
        }
      })
    },
    [maxHistory]
  )

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current

      const previous = current.past[current.past.length - 1]
      const newPast = current.past.slice(0, -1)

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current

      const next = current.future[0]
      const newFuture = current.future.slice(1)

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      }
    })
  }, [])

  const clear = useCallback(() => {
    setHistory((current) => ({
      past: [],
      present: current.present,
      future: [],
    }))
  }, [])

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return {
    state: history.present,
    setState,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    history,
  }
}
