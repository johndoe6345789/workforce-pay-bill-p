import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCsv, FileText, CheckCircle, XCircle, Warning, Download, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PermissionGate } from '@/components/PermissionGate'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  preview: Record<string, string>[]
}

interface BatchImportManagerProps {
  onImportComplete?: (data: any[]) => void
}

export function BatchImportManager({ onImportComplete }: BatchImportManagerProps) {
  const [csvData, setCsvData] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const validateCsv = (data: string, type: 'timesheets' | 'expenses' | 'workers') => {
    setIsValidating(true)
    
    setTimeout(() => {
      const lines = data.trim().split('\n')
      const errors: string[] = []
      const warnings: string[] = []
      const preview: Record<string, string>[] = []

      if (lines.length < 2) {
        errors.push('CSV must contain at least a header row and one data row')
        setValidationResult({
          valid: false,
          errors,
          warnings,
          rowCount: 0,
          preview: []
        })
        setIsValidating(false)
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const requiredFields = type === 'timesheets' 
        ? ['workerName', 'clientName', 'hours', 'rate', 'weekEnding']
        : type === 'expenses'
        ? ['workerName', 'clientName', 'amount', 'category', 'date']
        : ['name', 'email', 'type']

      const missingFields = requiredFields.filter(field => !headers.includes(field))
      if (missingFields.length > 0) {
        errors.push(`Missing required columns: ${missingFields.join(', ')}`)
      }

      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: Record<string, string> = {}
        
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })

        if (type === 'timesheets') {
          const hours = parseFloat(row.hours)
          const rate = parseFloat(row.rate)
          
          if (isNaN(hours) || hours <= 0) {
            errors.push(`Row ${i}: Invalid hours value`)
          }
          if (isNaN(rate) || rate <= 0) {
            errors.push(`Row ${i}: Invalid rate value`)
          }
          if (hours > 80) {
            warnings.push(`Row ${i}: Hours value ${hours} seems unusually high`)
          }
        }

        preview.push(row)
      }

      const rowCount = lines.length - 1

      if (rowCount > 100) {
        warnings.push(`Large import: ${rowCount} rows will be processed`)
      }

      setValidationResult({
        valid: errors.length === 0,
        errors,
        warnings,
        rowCount,
        preview
      })
      setIsValidating(false)
    }, 500)
  }

  const handleImport = () => {
    if (!validationResult?.valid) {
      toast.error('Cannot import data with validation errors')
      return
    }

    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const importedData: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: Record<string, any> = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index]
      })

      importedData.push(row)
    }

    onImportComplete?.(importedData)
    toast.success(`Successfully imported ${importedData.length} records`)
    setCsvData('')
    setValidationResult(null)
  }

  const sampleCsv = {
    timesheets: `workerName,clientName,hours,rate,weekEnding
John Smith,Acme Corp,37.5,25.50,2025-01-24
Jane Doe,Tech Solutions,40,30.00,2025-01-24
Robert Brown,Global Industries,35,28.75,2025-01-24`,
    expenses: `workerName,clientName,amount,category,date,description
John Smith,Acme Corp,45.50,Travel,2025-01-20,Train to client site
Jane Doe,Tech Solutions,120.00,Accommodation,2025-01-21,Hotel stay`,
    workers: `name,email,type,phone
John Smith,john.smith@example.com,contractor,+44 7700 900123
Jane Doe,jane.doe@example.com,employee,+44 7700 900456`
  }

  return (
    <PermissionGate permissions={['timesheets.create', 'expenses.create', 'workers.create']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Batch Import Manager</h2>
          <p className="text-muted-foreground mt-1">Import timesheets, expenses, and workers in bulk via CSV</p>
        </div>

      <Tabs defaultValue="timesheets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>

        {(['timesheets', 'expenses', 'workers'] as const).map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload size={20} />
                    Import Data
                  </CardTitle>
                  <CardDescription>
                    Paste CSV data or drag and drop a file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>CSV Data</Label>
                    <Textarea
                      placeholder={`Paste CSV data here...\n\n${sampleCsv[type]}`}
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      rows={12}
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => validateCsv(csvData, type)}
                      disabled={!csvData.trim() || isValidating}
                      className="flex-1"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      {isValidating ? 'Validating...' : 'Validate'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCsvData(sampleCsv[type])
                        toast.info('Sample data loaded')
                      }}
                    >
                      <FileText size={18} className="mr-2" />
                      Load Sample
                    </Button>
                  </div>

                  {validationResult && (
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          {validationResult.valid ? (
                            <>
                              <CheckCircle size={18} className="text-success" weight="fill" />
                              Validation Passed
                            </>
                          ) : (
                            <>
                              <XCircle size={18} className="text-destructive" weight="fill" />
                              Validation Failed
                            </>
                          )}
                        </h4>
                        <Badge variant={validationResult.valid ? 'success' : 'destructive'}>
                          {validationResult.rowCount} rows
                        </Badge>
                      </div>

                      {validationResult.errors.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-destructive">Errors:</p>
                          <ul className="text-sm space-y-1">
                            {validationResult.errors.map((error, i) => (
                              <li key={i} className="flex items-start gap-2 text-destructive">
                                <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validationResult.warnings.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-warning">Warnings:</p>
                          <ul className="text-sm space-y-1">
                            {validationResult.warnings.map((warning, i) => (
                              <li key={i} className="flex items-start gap-2 text-warning">
                                <Warning size={14} className="mt-0.5 flex-shrink-0" />
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validationResult.valid && (
                        <Button
                          onClick={handleImport}
                          className="w-full"
                          style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                        >
                          <Upload size={18} className="mr-2" />
                          Import {validationResult.rowCount} Records
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} />
                    Preview & Guidelines
                  </CardTitle>
                  <CardDescription>
                    Preview of first 5 rows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {validationResult && validationResult.preview.length > 0 ? (
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {validationResult.preview.map((row, i) => (
                          <div key={i} className="p-3 border rounded-lg bg-muted/30">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Row {i + 1}</p>
                            <div className="space-y-1">
                              {Object.entries(row).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="font-medium">{key}:</span>
                                  <span className="text-muted-foreground font-mono">{value || '(empty)'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
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
                          <li>• First row must be column headers</li>
                          <li>• Comma-separated values (CSV)</li>
                          <li>• No special characters in headers</li>
                          <li>• Date format: YYYY-MM-DD</li>
                          <li>• Numbers without currency symbols</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Required Columns</h4>
                        <div className="text-sm space-y-1">
                          {type === 'timesheets' && (
                            <>
                              <Badge variant="outline" className="mr-2">workerName</Badge>
                              <Badge variant="outline" className="mr-2">clientName</Badge>
                              <Badge variant="outline" className="mr-2">hours</Badge>
                              <Badge variant="outline" className="mr-2">rate</Badge>
                              <Badge variant="outline">weekEnding</Badge>
                            </>
                          )}
                          {type === 'expenses' && (
                            <>
                              <Badge variant="outline" className="mr-2">workerName</Badge>
                              <Badge variant="outline" className="mr-2">clientName</Badge>
                              <Badge variant="outline" className="mr-2">amount</Badge>
                              <Badge variant="outline" className="mr-2">category</Badge>
                              <Badge variant="outline">date</Badge>
                            </>
                          )}
                          {type === 'workers' && (
                            <>
                              <Badge variant="outline" className="mr-2">name</Badge>
                              <Badge variant="outline" className="mr-2">email</Badge>
                              <Badge variant="outline">type</Badge>
                            </>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const blob = new Blob([sampleCsv[type]], { type: 'text/csv' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `sample-${type}.csv`
                          a.click()
                          URL.revokeObjectURL(url)
                          toast.success('Sample template downloaded')
                        }}
                      >
                        <Download size={18} className="mr-2" />
                        Download Template
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      </div>
    </PermissionGate>
  )
}
