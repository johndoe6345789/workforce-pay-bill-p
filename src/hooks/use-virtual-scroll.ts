import { useState, useEffect, useRef, useCallback } from 'react'

export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
  totalItems: number
}

export interface VirtualScrollResult {
  virtualItems: Array<{
    index: number
    start: number
    size: number
  }>
  totalSize: number
  scrollToIndex: (index: number) => void
  containerProps: {
    style: React.CSSProperties
    onScroll: (e: React.UIEvent<HTMLElement>) => void
  }
  innerProps: {
    style: React.CSSProperties
  }
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  overscan = 3,
  totalItems,
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLElement | null>(null)

  const totalSize = totalItems * itemHeight

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  useEffect(() => {
    setScrollTop(0)
  }, [totalItems])

  const virtualItems: Array<{ index: number; start: number; size: number }> = []
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      size: itemHeight,
    })
  }

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
    containerRef.current = target
  }, [])

  const scrollToIndex = useCallback(
    (index: number) => {
      if (containerRef.current) {
        containerRef.current.scrollTop = index * itemHeight
      }
    },
    [itemHeight]
  )

  return {
    virtualItems,
    totalSize,
    scrollToIndex,
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      },
      onScroll: handleScroll,
    },
    innerProps: {
      style: {
        height: totalSize,
        position: 'relative',
      },
    },
  }
}
