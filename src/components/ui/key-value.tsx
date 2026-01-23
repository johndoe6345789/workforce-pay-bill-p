import * as React from 'react'
import { cn } from '@/lib/utils'

export interface KeyValuePairProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  className?: string
  vertical?: boolean
}

export function KeyValuePair({ label, value, className, vertical, ...props }: KeyValuePairProps) {
  return (
    <div
      className={cn(
        'flex gap-2',
        vertical ? 'flex-col' : 'items-center justify-between',
        className
      )}
      {...props}
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

export interface KeyValueListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: string; value: React.ReactNode }[]
  className?: string
  vertical?: boolean
}

export function KeyValueList({ items, className, vertical, ...props }: KeyValueListProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {items.map((item, index) => (
        <KeyValuePair
          key={index}
          label={item.label}
          value={item.value}
          vertical={vertical}
        />
      ))}
    </div>
  )
}
