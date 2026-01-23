import { useState, useCallback } from 'react'

export function useMap<K, V>(initialMap?: Map<K, V>) {
  const [map, setMap] = useState<Map<K, V>>(initialMap || new Map())

  const set = useCallback((key: K, value: V) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap)
      newMap.set(key, value)
      return newMap
    })
  }, [])

  const remove = useCallback((key: K) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const clear = useCallback(() => {
    setMap(new Map())
  }, [])

  const has = useCallback((key: K) => {
    return map.has(key)
  }, [map])

  const get = useCallback((key: K) => {
    return map.get(key)
  }, [map])

  const setAll = useCallback((entries: [K, V][]) => {
    setMap(new Map(entries))
  }, [])

  return {
    map,
    set,
    remove,
    clear,
    has,
    get,
    setAll,
    size: map.size,
    values: Array.from(map.values()),
    keys: Array.from(map.keys()),
    entries: Array.from(map.entries())
  }
}
