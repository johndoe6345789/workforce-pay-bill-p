import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { X } from '@phosphor-icons/react'

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
}

export function Tag({
  children,
  onRemove,
  variant = 'default',
  className,
  ...props
}: TagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
        variant === 'default' && 'bg-muted text-foreground',
        variant === 'primary' && 'bg-primary/10 text-primary',
        variant === 'success' && 'bg-success/10 text-success',
        variant === 'warning' && 'bg-warning/10 text-warning',
        variant === 'destructive' && 'bg-destructive/10 text-destructive',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TagGroup({ children, className, ...props }: TagGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}
