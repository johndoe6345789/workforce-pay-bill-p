import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxSelections?: number
  searchable?: boolean
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  maxSelections,
  searchable = true,
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter(opt => 
      opt.label.toLowerCase().includes(query) || 
      opt.value.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const selectedOptions = React.useMemo(() => {
    return options.filter(opt => value.includes(opt.value))
  }, [options, value])

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) return
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex min-h-10 w-full flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer',
          'ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <>
            {selectedOptions.map(opt => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(opt.value, e)}
                  className="hover:text-destructive"
                  disabled={disabled}
                >
                  <X size={12} weight="bold" />
                </button>
              </span>
            ))}
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                Clear all
              </button>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
          {searchable && (
            <div className="border-b p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = value.includes(opt.value)
                const isDisabled = opt.disabled || (maxSelections ? value.length >= maxSelections && !isSelected : false)
                
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent text-accent-foreground',
                      isDisabled && 'cursor-not-allowed opacity-50'
                    )}
                    onClick={() => !isDisabled && handleToggle(opt.value)}
                  >
                    <div className={cn(
                      'h-4 w-4 rounded border',
                      isSelected ? 'border-primary bg-primary' : 'border-input'
                    )}>
                      {isSelected && (
                        <svg
                          className="h-full w-full text-primary-foreground"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 8l3 3 7-7" />
                        </svg>
                      )}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                )
              })
            ) : (
              <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
