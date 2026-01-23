import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ComboBoxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  group?: string
}

export interface ComboBoxProps {
  options: ComboBoxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  showGroups?: boolean
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  emptyMessage = 'No options found',
  searchPlaceholder = 'Search...',
  disabled = false,
  showGroups = true,
  className
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter(opt =>
      opt.label.toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query) ||
      opt.description?.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const groupedOptions = React.useMemo(() => {
    if (!showGroups) return { '': filteredOptions }

    return filteredOptions.reduce((acc, opt) => {
      const group = opt.group || ''
      if (!acc[group]) acc[group] = []
      acc[group].push(opt)
      return acc
    }, {} as Record<string, ComboBoxOption[]>)
  }, [filteredOptions, showGroups])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover shadow-lg">
          <div className="border-b p-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-1">
            {Object.keys(groupedOptions).length > 0 ? (
              Object.entries(groupedOptions).map(([group, opts]) => (
                <div key={group}>
                  {group && (
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      {group}
                    </div>
                  )}
                  {opts.map(opt => {
                    const isSelected = opt.value === value
                    
                    return (
                      <button
                        key={opt.value}
                        onClick={() => !opt.disabled && handleSelect(opt.value)}
                        disabled={opt.disabled}
                        className={cn(
                          'flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-sm outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-accent text-accent-foreground',
                          opt.disabled && 'cursor-not-allowed opacity-50'
                        )}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {isSelected && (
                            <svg
                              className="h-4 w-4 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span className={!isSelected ? 'ml-6' : ''}>{opt.label}</span>
                        </div>
                        {opt.description && (
                          <span className={cn(
                            'text-xs text-muted-foreground',
                            isSelected ? 'ml-6' : 'ml-6'
                          )}>
                            {opt.description}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
