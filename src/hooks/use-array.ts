import { useState, useCallback } from 'react'

export function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue)

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element])
  }, [])

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray((prev) => prev.filter(callback))
  }, [])

  const update = useCallback((index: number, newElement: T) => {
    setArray((prev) => prev.map((item, i) => (i === index ? newElement : item)))
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  const set = useCallback((newArray: T[]) => {
    setArray(newArray)
  }, [])

  const insert = useCallback((index: number, element: T) => {
    setArray((prev) => {
      const newArray = [...prev]
      newArray.splice(index, 0, element)
      return newArray
    })
  }, [])

  const swap = useCallback((indexA: number, indexB: number) => {
    setArray((prev) => {
      const newArray = [...prev]
      const temp = newArray[indexA]
      newArray[indexA] = newArray[indexB]
      newArray[indexB] = temp
      return newArray
    })
  }, [])

  return {
    array,
    set,
    push,
    remove,
    filter,
    update,
    clear,
    insert,
    swap
  }
}
