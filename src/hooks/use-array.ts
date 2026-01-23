import { useState, useCallback } from 'react'

export interface UseArrayReturn<T> {
  array: T[]
  set: (newArray: T[]) => void
  push: (element: T) => void
  filter: (callback: (item: T, index: number) => boolean) => void
  update: (index: number, newElement: T) => void
  remove: (index: number) => void
  clear: () => void
  insert: (index: number, element: T) => void
  move: (fromIndex: number, toIndex: number) => void
  swap: (indexA: number, indexB: number) => void
}

export function useArray<T>(initialArray: T[] = []): UseArrayReturn<T> {
  const [array, setArray] = useState<T[]>(initialArray)

  const set = useCallback((newArray: T[]) => {
    setArray(newArray)
  }, [])

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element])
  }, [])

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray((prev) => prev.filter(callback))
  }, [])

  const update = useCallback((index: number, newElement: T) => {
    setArray((prev) => {
      const newArray = [...prev]
      newArray[index] = newElement
      return newArray
    })
  }, [])

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const insert = useCallback((index: number, element: T) => {
    setArray((prev) => {
      const newArray = [...prev]
      newArray.splice(index, 0, element)
      return newArray
    })
  }, [])

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setArray((prev) => {
      const newArray = [...prev]
      const [element] = newArray.splice(fromIndex, 1)
      newArray.splice(toIndex, 0, element)
      return newArray
    })
  }, [])

  const swap = useCallback((indexA: number, indexB: number) => {
    setArray((prev) => {
      const newArray = [...prev]
      ;[newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]]
      return newArray
    })
  }, [])

  return {
    array,
    set,
    push,
    filter,
    update,
    remove,
    clear,
    insert,
    move,
    swap
  }
}
