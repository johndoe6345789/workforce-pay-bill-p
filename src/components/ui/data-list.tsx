import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface DataListProps extends HTMLAttributes<HTMLDListElement> {
  items: Array<{
    label: string
    value: React.ReactNode
  }>
  orientation?: 'horizontal' | 'vertical'
}

export const DataList = forwardRef<HTMLDListElement, DataListProps>(
  ({ className, items, orientation = 'vertical', ...props }, ref) => {
    return (
      <dl
        ref={ref}
        className={cn(
          'space-y-3',
          orientation === 'horizontal' && 'grid grid-cols-2 gap-4',
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              orientation === 'vertical' && 'flex flex-col gap-1',
              orientation === 'horizontal' && 'contents'
            )}
          >
            <dt className="text-sm font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-sm font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    )
  }
)

DataList.displayName = 'DataList'
