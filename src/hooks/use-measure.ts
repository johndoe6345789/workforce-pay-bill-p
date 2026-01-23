import { useState, useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

export interface Dimensions {
  width: number
  height: number
  top: number
  left: number
  bottom: number
  right: number
  x: number
  y: number
}

export function useMeasure<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Dimensions
] {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  })

  const observerRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (node) {
      observerRef.current = new ResizeObserver(([entry]) => {
        if (entry && entry.contentRect) {
          const { width, height, top, left, bottom, right, x, y } = entry.contentRect
          setDimensions({ width, height, top, left, bottom, right, x, y })
        }
      })
      observerRef.current.observe(node)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return [ref, dimensions]
}
