import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Toolbar({ children, className, ...props }: ToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-border bg-card p-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ToolbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function ToolbarSection({ children, className, ...props }: ToolbarSectionProps) {
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <div
      className={cn('h-6 w-px bg-border', className)}
      {...props}
    />
  )
}
