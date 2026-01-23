import { useState, useCallback } from 'react'

export interface UseSetActions<T> {
  add: (item: T) => void
  remove: (item: T) => void
  toggle: (item: T) => void
  clear: () => void
  has: (item: T) => boolean
}

export function useSet<T>(
  initialValue?: Set<T>
): [Set<T>, UseSetActions<T>] {
  const [set, setSet] = useState<Set<T>>(initialValue || new Set())

  const add = useCallback((item: T) => {
    setSet((prev) => new Set(prev).add(item))
  }, [])

  const remove = useCallback((item: T) => {
    setSet((prev) => {
      const newSet = new Set(prev)
      newSet.delete(item)
      return newSet
    })
  }, [])

  const toggle = useCallback((item: T) => {
    setSet((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(item)) {
        newSet.delete(item)
      } else {
        newSet.add(item)
      }
      return newSet
    })
  }, [])

  const clear = useCallback(() => {
    setSet(new Set())
  }, [])

  const has = useCallback((item: T) => {
    return set.has(item)
  }, [set])

  return [
    set,
    {
      add,
      remove,
      toggle,
      clear,
      has
    }
  ]
}
