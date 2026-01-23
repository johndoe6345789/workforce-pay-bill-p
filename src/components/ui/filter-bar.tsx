import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Funnel, X } from '@phosphor-icons/react'
import { Badge } from './badge'

export interface FilterOption {
  key: string
  label: string
  value: any
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeFilters: FilterOption[]
  onRemoveFilter: (key: string) => void
  onClearAll: () => void
  onOpenFilters?: () => void
  showFilterButton?: boolean
}

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ 
    className, 
    activeFilters, 
    onRemoveFilter, 
    onClearAll, 
    onOpenFilters,
    showFilterButton = true,
    ...props 
  }, ref) => {
    if (activeFilters.length === 0 && !showFilterButton) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 flex-wrap',
          className
        )}
        {...props}
      >
        {showFilterButton && onOpenFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className="gap-2"
          >
            <Funnel className="h-4 w-4" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 min-w-5 rounded-full">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        )}

        {activeFilters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="gap-2 pr-1 pl-3 py-1.5"
          >
            <span className="text-xs">
              {filter.label}: <span className="font-semibold">{filter.value}</span>
            </span>
            <button
              onClick={() => onRemoveFilter(filter.key)}
              className="hover:bg-secondary-foreground/10 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
    )
  }
)
FilterBar.displayName = 'FilterBar'

export { FilterBar }
