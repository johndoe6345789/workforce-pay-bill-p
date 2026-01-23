import { useState, useMemo, useEffect } from 'react'
import { parseQuery, applyFilters, applySorting, type ParsedQuery } from '@/lib/query-parser'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, Funnel, X, Question, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

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

export function AdvancedSearch<T extends Record<string, any>>({
  items,
  fields,
  onResultsChange,
  placeholder = 'Search or use query language...',
  className
}: AdvancedSearchProps<T>) {
  const [query, setQuery] = useState('')
  const [showBuilder, setShowBuilder] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Array<{
    field: string
    operator: string
    value: string
  }>>([])

  const parsed = useMemo(() => parseQuery(query), [query])

  const filteredItems = useMemo(() => {
    let results = items

    if (parsed.filters.length > 0) {
      results = applyFilters(results, parsed.filters)
    }

    if (parsed.sortBy && parsed.sortOrder) {
      results = applySorting(results, parsed.sortBy, parsed.sortOrder)
    }

    return results
  }, [items, parsed])

  useEffect(() => {
    onResultsChange(filteredItems)
  }, [filteredItems])

  const addFilter = (field: string, operator: string, value: string) => {
    const newFilter = { field, operator, value }
    setActiveFilters([...activeFilters, newFilter])
    
    const filterQuery = `${field} ${operator} "${value}"`
    setQuery(prev => prev ? `${prev} ${filterQuery}` : filterQuery)
  }

  const removeFilter = (index: number) => {
    const newFilters = activeFilters.filter((_, i) => i !== index)
    setActiveFilters(newFilters)
    
    const newQuery = newFilters
      .map(f => `${f.field} ${f.operator} "${f.value}"`)
      .join(' ')
    setQuery(newQuery)
  }

  const clearAll = () => {
    setQuery('')
    setActiveFilters([])
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={clearAll}
            >
              <X size={14} />
            </Button>
          )}
        </div>

        <Popover open={showBuilder} onOpenChange={setShowBuilder}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Funnel size={18} className="mr-2" />
              Filter Builder
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <FilterBuilder 
              fields={fields} 
              onAddFilter={(field, operator, value) => {
                addFilter(field, operator, value)
                setShowBuilder(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Question size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <QueryHelp fields={fields} />
          </PopoverContent>
        </Popover>
      </div>

      {parsed.filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {parsed.filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 pr-1"
            >
              <span className="font-mono text-xs">
                {filter.field} {filter.operator} {String(filter.value)}
              </span>
              <button
                onClick={() => {
                  const newFilters = parsed.filters.filter((_, i) => i !== index)
                  const newQuery = newFilters
                    .map(f => `${f.field} ${f.operator} "${f.value}"`)
                    .join(' ')
                  setQuery(newQuery)
                }}
                className="ml-1 hover:bg-secondary-foreground/20 rounded p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
          {parsed.sortBy && (
            <Badge variant="outline" className="gap-1">
              <span className="font-mono text-xs">
                sort: {parsed.sortBy} {parsed.sortOrder}
              </span>
            </Badge>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Showing {filteredItems.length} of {items.length} results
      </div>
    </div>
  )
}

interface FilterBuilderProps {
  fields: FilterField[]
  onAddFilter: (field: string, operator: string, value: string) => void
}

function FilterBuilder({ fields, onAddFilter }: FilterBuilderProps) {
  const [selectedField, setSelectedField] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('contains')
  const [value, setValue] = useState('')

  const field = fields.find(f => f.name === selectedField)

  const operators = field?.type === 'number'
    ? [
        { value: '=', label: 'Equals' },
        { value: '>', label: 'Greater than' },
        { value: '>=', label: 'Greater or equal' },
        { value: '<', label: 'Less than' },
        { value: '<=', label: 'Less or equal' }
      ]
    : field?.type === 'select'
    ? [
        { value: '=', label: 'Equals' },
        { value: 'in', label: 'In list' }
      ]
    : [
        { value: 'contains', label: 'Contains' },
        { value: '=', label: 'Equals' },
        { value: 'starts', label: 'Starts with' },
        { value: 'ends', label: 'Ends with' }
      ]

  const handleAdd = () => {
    if (selectedField && value) {
      onAddFilter(selectedField, selectedOperator, value)
      setSelectedField('')
      setValue('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-1">Build Filter</h4>
        <p className="text-xs text-muted-foreground">
          Create filters visually without query syntax
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Field</Label>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map(field => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedField && (
          <>
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              {field?.type === 'select' ? (
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                />
              )}
            </div>
          </>
        )}
      </div>

      <Button onClick={handleAdd} disabled={!selectedField || !value} className="w-full">
        <Plus size={16} className="mr-2" />
        Add Filter
      </Button>
    </div>
  )
}

interface QueryHelpProps {
  fields: FilterField[]
}

function QueryHelp({ fields }: QueryHelpProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-1">Query Language Help</h4>
        <p className="text-xs text-muted-foreground">
          Build powerful queries using simple syntax
        </p>
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Available Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {fields.map(field => (
            <div key={field.name} className="flex items-center justify-between text-xs">
              <code className="bg-background px-1.5 py-0.5 rounded">{field.name}</code>
              <span className="text-muted-foreground">{field.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h5 className="text-sm font-semibold">Operators</h5>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <code className="bg-muted px-1.5 py-0.5 rounded">:</code>
            <span className="text-muted-foreground">contains text</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-1.5 py-0.5 rounded">=</code>
            <span className="text-muted-foreground">equals exactly</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-1.5 py-0.5 rounded">&gt; &lt;</code>
            <span className="text-muted-foreground">greater/less than</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-1.5 py-0.5 rounded">in</code>
            <span className="text-muted-foreground">in list (comma-separated)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-sm font-semibold">Examples</h5>
        <div className="space-y-1.5">
          <div className="bg-muted p-2 rounded text-xs font-mono">
            status = pending
          </div>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            workerName : Smith hours &gt; 40
          </div>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            status in pending,approved
          </div>
          <div className="bg-muted p-2 rounded text-xs font-mono">
            amount &gt; 1000 sort amount desc
          </div>
        </div>
      </div>
    </div>
  )
}
