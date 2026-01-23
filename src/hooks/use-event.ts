import { useCallback, useRef } from 'react'

export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef(value)
  
  ref.current = value
  
  return ref
}

export function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useLatest(handler)
  
  return useCallback((...args: Parameters<T>) => {
    return handlerRef.current(...args)
  }, []) as T
}
