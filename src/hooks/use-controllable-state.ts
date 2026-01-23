import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseControllableStateOptions<T> {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T | undefined, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  
  const onChangeRef = useRef(onChange)
  
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const setValue = useCallback((nextValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }
    onChangeRef.current?.(nextValue)
  }, [isControlled])

  return [value, setValue]
}
