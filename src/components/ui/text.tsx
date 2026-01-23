import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right' | 'justify'
  truncate?: boolean
  muted?: boolean
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      as: Component = 'p',
      size = 'base',
      weight,
      align,
      truncate = false,
      muted = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          sizeClasses[size],
          weight && weightClasses[weight],
          align && alignClasses[align],
          truncate && 'truncate',
          muted && 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = 'Text'

export { Text }
