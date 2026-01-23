import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Info } from '@phosphor-icons/react'
import { Button } from './button'

export interface InfoBoxProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  variant?: 'info' | 'warning' | 'success' | 'error'
  dismissible?: boolean
  onDismiss?: () => void
}

const variantClasses = {
  info: 'bg-info/10 border-info/20 text-info',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  success: 'bg-success/10 border-success/20 text-success',
  error: 'bg-destructive/10 border-destructive/20 text-destructive'
}

export const InfoBox = forwardRef<HTMLDivElement, InfoBoxProps>(
  ({ className, title, variant = 'info', dismissible, onDismiss, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border p-4',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" weight="bold" />
          <div className="flex-1">
            {title && (
              <h5 className="font-semibold mb-1">{title}</h5>
            )}
            <div className="text-sm">{children}</div>
          </div>
          {dismissible && onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={onDismiss}
            >
              ×
            </Button>
          )}
        </div>
      </div>
    )
  }
)

InfoBox.displayName = 'InfoBox'
