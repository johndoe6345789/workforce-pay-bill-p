import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileCsv, Download } from '@phosphor-icons/react'

interface FieldDef {
  name: string
  label: string
  required: boolean
  type?: string
}

interface Props {
  defs: FieldDef[]
  onDownloadTemplate: () => void
}

export function FormatGuidelinesContent({ defs, onDownloadTemplate }: Props) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <FileCsv size={18} />
          Required Format
        </h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• First row should contain column headers</li>
          <li>• Comma-separated values (CSV format)</li>
          <li>• No special characters in headers</li>
          <li>• Date format: YYYY-MM-DD</li>
          <li>• Numbers without currency symbols</li>
          <li>• Email addresses must be valid format</li>
        </ul>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-3">Required Fields</h4>
        <div className="flex flex-wrap gap-2">
          {defs.filter(f => f.required).map(field => (
            <Badge key={field.name} variant="outline">
              {field.label}
              {field.type && <span className="ml-1 text-muted-foreground">({field.type})</span>}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-3">Optional Fields</h4>
        <div className="flex flex-wrap gap-2">
          {defs.filter(f => !f.required).map(field => (
            <Badge key={field.name} variant="secondary">{field.label}</Badge>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={onDownloadTemplate}>
        <Download size={18} className="mr-2" />
        Download CSV Template
      </Button>
    </div>
  )
}
