import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ReportFilter } from '@/hooks/useCustomReportBuilder'

const FILTER_OPERATORS: { value: string; label: string }[] = [
  { value: 'equals',   label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater',  label: 'Greater than' },
  { value: 'less',     label: 'Less than' },
]

interface Props {
  filters: ReportFilter[]
  availableFilters: string[]
  onUpdate: (i: number, updates: Partial<ReportFilter>) => void
  onRemove: (i: number) => void
}

export function ReportFilterRows({ filters, availableFilters, onUpdate, onRemove }: Props) {
  if (filters.length === 0) {
    return <p className="text-sm text-muted-foreground">No filters applied</p>
  }
  return (
    <div className="space-y-2">
      {filters.map((filter, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Select value={filter.field} onValueChange={v => onUpdate(i, { field: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {availableFilters.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Select value={filter.operator} onValueChange={(v: ReportFilter['operator']) => onUpdate(i, { operator: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FILTER_OPERATORS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Input placeholder="Value" value={filter.value} onChange={e => onUpdate(i, { value: e.target.value })} />
          </div>
          <Button size="sm" variant="destructive" onClick={() => onRemove(i)}>Remove</Button>
        </div>
      ))}
    </div>
  )
}
