import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './loading-spinner'

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  text?: string
}

export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, isLoading, text, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <LoadingSpinner size="lg" />
            {text && (
              <p className="mt-4 text-sm text-muted-foreground">{text}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

LoadingOverlay.displayName = 'LoadingOverlay'
