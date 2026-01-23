import { useState, useCallback } from 'react'

export function useSet<T>(initialSet?: Set<T>) {
  const [set, setSet] = useState<Set<T>>(initialSet || new Set())

  const add = useCallback((value: T) => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet)
      newSet.add(value)
      return newSet
    })
  }, [])

  const remove = useCallback((value: T) => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet)
      newSet.delete(value)
      return newSet
    })
  }, [])

  const toggle = useCallback((value: T) => {
    setSet((prevSet) => {
      const newSet = new Set(prevSet)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    })
  }, [])

  const clear = useCallback(() => {
    setSet(new Set())
  }, [])

  const has = useCallback((value: T) => {
    return set.has(value)
  }, [set])

  const reset = useCallback(() => {
    setSet(initialSet || new Set())
  }, [initialSet])

  return {
    set,
    add,
    remove,
    toggle,
    clear,
    has,
    reset,
    size: set.size,
    values: Array.from(set)
  }
}
