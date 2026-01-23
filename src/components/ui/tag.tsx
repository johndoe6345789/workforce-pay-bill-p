import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'
  size?: 'sm' | 'md' | 'lg'
  onRemove?: () => void
  removable?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    onRemove,
    removable = false,
    children, 
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-muted text-muted-foreground hover:bg-muted/80',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      success: 'bg-success/10 text-success hover:bg-success/20',
      warning: 'bg-warning/10 text-warning hover:bg-warning/20',
      destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      info: 'bg-info/10 text-info hover:bg-info/20'
    }

    const sizeClasses = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5'
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          (onRemove || removable) && 'pr-1',
          className
        )}
        {...props}
      >
        {children}
        {(onRemove || removable) && (
          <button
            type="button"
            onClick={onRemove}
            className="hover:bg-current/10 rounded-full p-0.5 transition-colors"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    )
  }
)
Tag.displayName = 'Tag'

export { Tag }
