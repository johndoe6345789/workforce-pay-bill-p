import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CaretDown, CaretUp } from '@phosphor-icons/react'

export interface SortableHeaderProps extends HTMLAttributes<HTMLButtonElement> {
  label: string
  active: boolean
  direction?: 'asc' | 'desc'
}

export const SortableHeader = forwardRef<HTMLButtonElement, SortableHeaderProps>(
  ({ className, label, active, direction = 'asc', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center gap-2 font-medium hover:text-foreground transition-colors',
          active ? 'text-foreground' : 'text-muted-foreground',
          className
        )}
        {...props}
      >
        <span>{label}</span>
        <div className="flex flex-col">
          {active ? (
            direction === 'asc' ? (
              <CaretUp className="h-3 w-3" weight="bold" />
            ) : (
              <CaretDown className="h-3 w-3" weight="bold" />
            )
          ) : (
            <div className="h-3 w-3 opacity-30">
              <CaretUp className="h-1.5 w-3" />
              <CaretDown className="h-1.5 w-3 -mt-0.5" />
            </div>
          )}
        </div>
      </button>
    )
  }
)

SortableHeader.displayName = 'SortableHeader'
