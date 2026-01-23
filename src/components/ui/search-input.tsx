import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Button } from './button'

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={ref}
          type="search"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          value={value}
          {...props}
        />
        {value && onClear && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
