import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import type { Timesheet } from '@/lib/types'

interface Props {
  items: Timesheet[]
  fields: FilterField[]
  onResultsChange: (results: Timesheet[]) => void
  title: string
  description: string
  resultsLabel: string
  placeholder: string
}

export function TimesheetSearchPanel({
  items, fields, onResultsChange, title, description, resultsLabel, placeholder,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-xs mt-1">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono">{resultsLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <AdvancedSearch
          items={items}
          fields={fields}
          onResultsChange={onResultsChange}
          placeholder={placeholder}
        />
      </CardContent>
    </Card>
  )
}
