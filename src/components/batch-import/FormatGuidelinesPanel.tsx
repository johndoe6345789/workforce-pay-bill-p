import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, FileCsv, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { FIELD_DEFINITIONS, SAMPLE_CSV } from '@/data/batchImportConfig'
import type { ImportType } from '@/data/batchImportConfig'
import type { ValidationResult } from '@/hooks/useBatchImport'

interface Props {
  type: ImportType
  validationResult: ValidationResult | null
}

export function FormatGuidelinesPanel({ type, validationResult }: Props) {
  const defs = FIELD_DEFINITIONS[type]

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV[type]], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sample-${type}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Sample template downloaded')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          {validationResult ? 'Data Preview' : 'Format Guidelines'}
        </CardTitle>
        <CardDescription>
          {validationResult ? 'First 5 rows of your data' : 'CSV format requirements'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validationResult && validationResult.preview.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {validationResult.preview.map((row, i) => (
                <Card key={i} className="bg-muted/30">
                  <CardContent className="pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Row {i + 1}</p>
                    <div className="space-y-1">
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm gap-4">
                          <span className="font-medium text-muted-foreground">{key}:</span>
                          <span className="font-mono text-foreground">{value || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
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
            <Button variant="outline" className="w-full" onClick={downloadTemplate}>
              <Download size={18} className="mr-2" />
              Download CSV Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
