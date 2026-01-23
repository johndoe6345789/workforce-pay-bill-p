import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  keys: string[]
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, keys, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-semibold text-muted-foreground',
          className
        )}
        {...props}
      >
        {keys.map((key, index) => (
          <span key={index}>
            {key}
            {index < keys.length - 1 && <span className="mx-1">+</span>}
          </span>
        ))}
      </kbd>
    )
  }
)

Kbd.displayName = 'Kbd'
