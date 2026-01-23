import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'
import { Button } from './button'

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
}

const variantClasses = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-accent text-accent-foreground',
  outline: 'border-2 border-border bg-transparent'
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, label, onRemove, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span>{label}</span>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }
)

Chip.displayName = 'Chip'
