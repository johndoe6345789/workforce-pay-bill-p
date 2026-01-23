import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './badge'
import { X } from '@phosphor-icons/react'

export interface FilterChip {
  id: string
  label: string
  value: string
  field?: string
  removable?: boolean
}

export interface FilterChipsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: FilterChip[]
  onRemove?: (id: string) => void
  onClearAll?: () => void
  showClearAll?: boolean
}

const FilterChipsBar = React.forwardRef<HTMLDivElement, FilterChipsBarProps>(
  (
    {
      filters,
      onRemove,
      onClearAll,
      showClearAll = true,
      className,
      ...props
    },
    ref
  ) => {
    if (filters.length === 0) return null

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center gap-2', className)}
        {...props}
      >
        <span className="text-sm text-muted-foreground">Filters:</span>
        {filters.map((filter) => (
          <Badge
            key={filter.id}
            variant="secondary"
            className="flex items-center gap-1.5 pr-1"
          >
            <span className="text-xs">
              {filter.field && (
                <span className="font-semibold">{filter.field}: </span>
              )}
              {filter.label}
            </span>
            {filter.removable !== false && onRemove && (
              <button
                onClick={() => onRemove(filter.id)}
                className="rounded-sm hover:bg-muted p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </Badge>
        ))}
        {showClearAll && filters.length > 1 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        )}
      </div>
    )
  }
)
FilterChipsBar.displayName = 'FilterChipsBar'

export { FilterChipsBar }
