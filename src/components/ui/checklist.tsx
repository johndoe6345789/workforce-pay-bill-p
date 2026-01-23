import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from '@phosphor-icons/react'

export interface ChecklistProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ChecklistItem[]
  onItemToggle?: (id: string) => void
  variant?: 'default' | 'compact'
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  description?: string
}

const Checklist = React.forwardRef<HTMLDivElement, ChecklistProps>(
  ({ className, items, onItemToggle, variant = 'default', ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-border p-3 transition-colors',
              item.checked && 'bg-muted/50',
              onItemToggle && 'cursor-pointer hover:bg-muted/50'
            )}
            onClick={() => onItemToggle?.(item.id)}
          >
            <div
              className={cn(
                'mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                item.checked
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input'
              )}
            >
              {item.checked && <Check weight="bold" size={14} />}
            </div>
            <div className="flex-1 space-y-1">
              <div
                className={cn(
                  'text-sm font-medium leading-none',
                  item.checked && 'line-through text-muted-foreground'
                )}
              >
                {item.label}
              </div>
              {variant === 'default' && item.description && (
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
)
Checklist.displayName = 'Checklist'

export { Checklist }
