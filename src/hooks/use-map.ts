import { useState, useCallback } from 'react'

export interface UseMapActions<K, V> {
  set: (key: K, value: V) => void
  remove: (key: K) => void
  clear: () => void
  setAll: (entries: [K, V][]) => void
}

export function useMap<K, V>(
  initialValue?: Map<K, V>
): [Map<K, V>, UseMapActions<K, V>] {
  const [map, setMap] = useState<Map<K, V>>(initialValue || new Map())

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const newMap = new Map(prev)
      newMap.set(key, value)
      return newMap
    })
  }, [])

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const clear = useCallback(() => {
    setMap(new Map())
  }, [])

  const setAll = useCallback((entries: [K, V][]) => {
    setMap(new Map(entries))
  }, [])

  return [
    map,
    {
      set,
      remove,
      clear,
      setAll
    }
  ]
}
