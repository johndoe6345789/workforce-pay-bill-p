import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

export interface VirtualScrollOptions {
  itemHeight: number
  overscan?: number
  containerHeight?: number
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const {
    itemHeight,
    overscan = 3,
    containerHeight = 600
  } = options

  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
      offsetTop: (visibleRange.startIndex + index) * itemHeight
    }))
  }, [items, visibleRange, itemHeight])

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    const container = containerRef.current
    if (!container) return

    let scrollPosition: number

    switch (align) {
      case 'center':
        scrollPosition = index * itemHeight - containerHeight / 2 + itemHeight / 2
        break
      case 'end':
        scrollPosition = index * itemHeight - containerHeight + itemHeight
        break
      default:
        scrollPosition = index * itemHeight
    }

    container.scrollTo({
      top: Math.max(0, Math.min(scrollPosition, totalHeight - containerHeight)),
      behavior: 'smooth'
    })
  }, [itemHeight, containerHeight, totalHeight])

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollTo({ top: totalHeight, behavior: 'smooth' })
  }, [totalHeight])

  return {
    containerRef,
    totalHeight,
    visibleItems,
    visibleRange,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    scrollTop
  }
}
