import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'

export interface DataPillProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
  className?: string
}

export function DataPill({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  className
}: DataPillProps) {
  const variantStyles = {
    default: 'bg-secondary text-secondary-foreground border-secondary',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-info/10 text-info border-info/20'
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} weight="bold" />
        </button>
      )}
    </span>
  )
}

export interface DataGroupProps {
  label?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function DataGroup({
  label,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className
}: DataGroupProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div
          className={cn(
            'flex items-center gap-2 text-sm font-semibold text-muted-foreground',
            collapsible && 'cursor-pointer select-none'
          )}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          {collapsible && (
            <svg
              className={cn('h-4 w-4 transition-transform', !isCollapsed && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {label}
        </div>
      )}
      {(!collapsible || !isCollapsed) && (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
