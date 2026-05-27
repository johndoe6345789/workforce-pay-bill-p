import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import type { FilterField } from '@/components/AdvancedSearch'
import { getOperators } from '@/data/filter-operators'

interface Props {
  fields: FilterField[]
  onAddFilter: (field: string, operator: string, value: string) => void
}

export function FilterBuilder({ fields, onAddFilter }: Props) {
  const [selectedField, setSelectedField] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('contains')
  const [value, setValue] = useState('')

  const field = fields.find(f => f.name === selectedField)
  const operators = getOperators(field)

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
        <p className="text-xs text-muted-foreground">Create filters visually without query syntax</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Field</Label>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
            <SelectContent>
              {fields.map(f => <SelectItem key={f.name} value={f.name}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {selectedField && (
          <>
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {operators.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              {field?.type === 'select' ? (
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger><SelectValue placeholder="Select value" /></SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="Enter value"
                />
              )}
            </div>
          </>
        )}
      </div>
      <Button onClick={handleAdd} disabled={!selectedField || !value} className="w-full">
        <Plus size={16} className="mr-2" />Add Filter
      </Button>
    </div>
  )
}
