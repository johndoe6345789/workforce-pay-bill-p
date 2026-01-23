import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from '@phosphor-icons/react'
import { Button } from './button'

export interface FilterChip {
  id: string
  label: string
  value: string
}

export interface FilterChipsProps {
  filters: FilterChip[]
  onRemove: (id: string) => void
  onClearAll?: () => void
  className?: string
}

export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map(filter => (
        <div
          key={filter.id}
          className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm"
        >
          <span className="font-medium">{filter.label}:</span>
          <span className="text-muted-foreground">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-1 rounded-full hover:bg-accent/30 p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {filters.length > 1 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
