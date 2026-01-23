import * as React from 'react'
import { cn } from '@/lib/utils'
import { Star } from '@phosphor-icons/react'

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number
  max?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value = 0,
      max = 5,
      readonly = false,
      size = 'md',
      onChange,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    const handleClick = (index: number) => {
      if (!readonly && onChange) {
        onChange(index + 1)
      }
    }

    const displayValue = hoverValue !== null ? hoverValue : value

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        onMouseLeave={() => setHoverValue(null)}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => {
          const isFilled = index < displayValue

          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(index)}
              onMouseEnter={() => !readonly && setHoverValue(index + 1)}
              className={cn(
                'transition-all',
                !readonly && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
              aria-label={`Rate ${index + 1} out of ${max}`}
            >
              <Star
                weight={isFilled ? 'fill' : 'regular'}
                className={cn(
                  sizeClasses[size],
                  isFilled ? 'text-warning' : 'text-muted-foreground'
                )}
              />
            </button>
          )
        })}
      </div>
    )
  }
)
Rating.displayName = 'Rating'

export { Rating }
