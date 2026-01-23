import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function ActionBar({ children, className, ...props }: ActionBarProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-4 border-t border-border bg-card px-6 py-4 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
