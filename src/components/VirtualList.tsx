import { useVirtualScroll } from '@/hooks/use-virtual-scroll'
import { cn } from '@/lib/utils'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  itemClassName?: string
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  renderItem,
  className,
  itemClassName,
}: VirtualListProps<T>) {
  const { virtualItems, containerProps, innerProps } = useVirtualScroll({
    itemHeight,
    containerHeight,
    overscan,
    totalItems: items.length,
  })

  return (
    <div {...containerProps} className={cn('overflow-auto', className)}>
      <div {...innerProps}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index]
          return (
            <div
              key={virtualItem.index}
              className={cn('absolute left-0 right-0', itemClassName)}
              style={{
                top: virtualItem.start,
                height: virtualItem.size,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
