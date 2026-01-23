import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DataValue {
  label: string
  value: string | number | React.ReactNode
  badge?: React.ReactNode
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DataValue[]
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: 1 | 2 | 3 | 4
}

const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ items, layout = 'horizontal', columns = 2, className, ...props }, ref) => {
    const layoutStyles = {
      vertical: 'flex flex-col gap-4',
      horizontal: 'grid gap-4',
      grid: `grid gap-4 grid-cols-1 md:grid-cols-${columns}`,
    }

    return (
      <dl
        ref={ref}
        className={cn(layoutStyles[layout], className)}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              layout === 'horizontal' && 'grid grid-cols-3 gap-4',
              layout === 'vertical' && 'flex flex-col gap-1',
              layout === 'grid' && 'flex flex-col gap-1'
            )}
          >
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {item.label}
              {item.badge}
            </dt>
            <dd
              className={cn(
                'text-sm',
                layout === 'horizontal' && 'col-span-2',
                typeof item.value === 'string' || typeof item.value === 'number'
                  ? 'text-foreground'
                  : ''
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    )
  }
)
DescriptionList.displayName = 'DescriptionList'

export { DescriptionList }
