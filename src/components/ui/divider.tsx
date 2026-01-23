import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn('w-px bg-border', className)}
          {...props}
        />
      )
    }

    if (label) {
      return (
        <div
          ref={ref}
          className={cn('relative flex items-center py-4', className)}
          {...props}
        >
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-sm text-muted-foreground">{label}</span>
          <div className="flex-1 border-t border-border" />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('h-px bg-border', className)}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'
