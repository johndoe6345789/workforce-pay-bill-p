import { useCallback } from 'react'

type Ref<T> = React.Ref<T> | undefined

export function useMergeRefs<T>(...refs: Ref<T>[]): (instance: T | null) => void {
  return useCallback((instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = instance
      }
    })
  }, refs)
}
