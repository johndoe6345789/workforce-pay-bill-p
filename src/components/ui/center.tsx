import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, inline = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          'items-center justify-center',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Center.displayName = 'Center'

export { Center }
