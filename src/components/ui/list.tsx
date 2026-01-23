import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'divided'
}

export function List({ children, variant = 'default', className, ...props }: ListProps) {
  return (
    <ul
      className={cn(
        'space-y-0',
        variant === 'bordered' && 'border border-border rounded-lg overflow-hidden',
        variant === 'divided' && 'divide-y divide-border',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
  interactive?: boolean
}

export function ListItem({ children, interactive, className, ...props }: ListItemProps) {
  return (
    <li
      className={cn(
        'px-4 py-3 bg-card',
        interactive && 'hover:bg-muted/50 cursor-pointer transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}

export interface ListItemTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ListItemTitle({ children, className, ...props }: ListItemTitleProps) {
  return (
    <div className={cn('font-medium text-foreground', className)} {...props}>
      {children}
    </div>
  )
}

export interface ListItemDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ListItemDescription({ children, className, ...props }: ListItemDescriptionProps) {
  return (
    <div className={cn('text-sm text-muted-foreground mt-1', className)} {...props}>
      {children}
    </div>
  )
}
