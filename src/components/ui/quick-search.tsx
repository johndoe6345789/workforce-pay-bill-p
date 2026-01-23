import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { MagnifyingGlass } from '@phosphor-icons/react'

export interface QuickSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void
  debounceMs?: number
}

const QuickSearch = React.forwardRef<HTMLInputElement, QuickSearchProps>(
  ({ onSearch, debounceMs = 300, className, ...props }, ref) => {
    const [value, setValue] = React.useState<string>('')
    const timeoutRef = React.useRef<number | undefined>(undefined)

    React.useEffect(() => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        onSearch(value)
      }, debounceMs) as unknown as number

      return () => {
        if (timeoutRef.current !== undefined) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [value, debounceMs, onSearch])

    return (
      <div className={cn('relative', className)}>
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-10"
          placeholder="Quick search..."
          {...props}
        />
      </div>
    )
  }
)
QuickSearch.displayName = 'QuickSearch'

export { QuickSearch }
