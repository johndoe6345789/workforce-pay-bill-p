import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MagnifyingGlass, Funnel, X, Question } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import { FilterBuilder } from '@/components/advanced-search/FilterBuilder'
import { QueryHelp } from '@/components/advanced-search/QueryHelp'

export interface FilterField {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select'
  options?: { value: string; label: string }[]
}

export interface AdvancedSearchProps<T> {
  items: T[]
  fields: FilterField[]
  onResultsChange: (results: T[]) => void
  placeholder?: string
  className?: string
}

export function AdvancedSearch<T extends Record<string, unknown>>({
  items,
  fields,
  onResultsChange,
  placeholder = 'Search by any field or use query language (e.g., status = pending)...',
  className
}: AdvancedSearchProps<T>) {
  const vm = useAdvancedSearch(items, fields, onResultsChange)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={vm.query}
            onChange={e => vm.setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {vm.query && (
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={vm.clearAll}>
              <X size={14} />
            </Button>
          )}
        </div>
        <Popover open={vm.showBuilder} onOpenChange={vm.setShowBuilder}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm"><Funnel size={18} className="mr-2" />Filter Builder</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <FilterBuilder fields={fields} onAddFilter={(field, operator, value) => { vm.addFilter(field, operator, value); vm.setShowBuilder(false) }} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm"><Question size={18} /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <QueryHelp fields={fields} />
          </PopoverContent>
        </Popover>
      </div>

      {vm.parsed.filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {vm.parsed.filters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="gap-1 pr-1">
              <span className="font-mono text-xs">{filter.field} {filter.operator} {String(filter.value)}</span>
              <button onClick={() => vm.removeFilter(index)} className="ml-1 hover:bg-secondary-foreground/20 rounded p-0.5">
                <X size={12} />
              </button>
            </Badge>
          ))}
          {vm.parsed.sortBy && (
            <Badge variant="outline" className="gap-1">
              <span className="font-mono text-xs">sort: {vm.parsed.sortBy} {vm.parsed.sortOrder}</span>
            </Badge>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Showing {vm.filteredItems.length} of {vm.totalCount} results
      </div>
    </div>
  )
}
