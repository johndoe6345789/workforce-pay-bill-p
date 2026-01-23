import { useEffect, useRef } from 'react'

export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void | Promise<void>,
  delay: number = 2000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const dataRef = useRef<T>(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onSave(dataRef.current)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, onSave])
}
