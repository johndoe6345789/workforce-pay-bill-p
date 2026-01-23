import * as React from 'react'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
  as?: React.ElementType
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, asChild = false, as: Component = 'div', children, ...props }, ref) => {
    const Comp = asChild ? Slot : Component

    return (
      <Comp ref={ref} className={cn(className)} {...props}>
        {children}
      </Comp>
    )
  }
)
Box.displayName = 'Box'

export { Box }
