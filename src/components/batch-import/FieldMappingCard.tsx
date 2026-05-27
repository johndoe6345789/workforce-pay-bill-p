import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapTrifold, ArrowRight } from '@phosphor-icons/react'
import type { FieldMapping } from '@/hooks/useBatchImport'

interface Props {
  fieldMappings: FieldMapping[]
  setFieldMappings: (mappings: FieldMapping[]) => void
}

export function FieldMappingCard({ fieldMappings, setFieldMappings }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapTrifold size={20} />
          Field Mapping
        </CardTitle>
        <CardDescription>Configure how CSV fields map to system fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fieldMappings.map((mapping, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{mapping.sourceField}</p>
                <p className="text-xs text-muted-foreground">Source field</p>
              </div>
              <ArrowRight size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{mapping.targetField}</p>
                <p className="text-xs text-muted-foreground">Target field</p>
              </div>
              <Select
                value={mapping.transform}
                onValueChange={value => {
                  const updated = [...fieldMappings]
                  updated[index] = { ...updated[index], transform: value as FieldMapping['transform'] }
                  setFieldMappings(updated)
                }}
              >
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="uppercase">Uppercase</SelectItem>
                  <SelectItem value="lowercase">Lowercase</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
