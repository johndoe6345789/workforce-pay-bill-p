import { useEffect, DependencyList } from 'react'

export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: DependencyList
): void {
  const isFirstRender = useFirstRender()

  useEffect(() => {
    if (!isFirstRender) {
      return effect()
    }
  }, deps)
}

function useFirstRender(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false
    return true
  }

  return false
}

import { useRef } from 'react'
