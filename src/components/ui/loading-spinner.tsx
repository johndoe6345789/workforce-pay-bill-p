import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4'
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-solid border-primary border-t-transparent',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'
