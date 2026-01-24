import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileCsv, FileText, CheckCircle, XCircle, Warning, Download, Upload, MapTrifold, ArrowRight, Play, X, FileArrowUp } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PermissionGate } from '@/components/PermissionGate'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { useExpensesCrud } from '@/hooks/use-expenses-crud'
import { useWorkersCrud } from '@/hooks/use-workers-crud'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  preview: Record<string, string>[]
  headers: string[]
}

interface FieldMapping {
  sourceField: string
  targetField: string
  transform?: 'none' | 'uppercase' | 'lowercase' | 'date' | 'number'
  required: boolean
}

interface ImportProgress {
  total: number
  processed: number
  succeeded: number
  failed: number
  errors: { row: number; error: string }[]
}

interface BatchImportManagerProps {
  onImportComplete?: (data: any[]) => void
}

type ImportType = 'timesheets' | 'expenses' | 'workers'

export function BatchImportManager({ onImportComplete }: BatchImportManagerProps) {
  const [activeTab, setActiveTab] = useState<ImportType>('timesheets')
  const [csvData, setCsvData] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showMapping, setShowMapping] = useState(false)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [skipFirstRow, setSkipFirstRow] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { createTimesheet } = useTimesheetsCrud()
  const { createExpense } = useExpensesCrud()
  const { createWorker } = useWorkersCrud()

  const fieldDefinitions = {
    timesheets: [
      { name: 'workerName', label: 'Worker Name', required: true, type: 'text' as const },
      { name: 'clientName', label: 'Client Name', required: true, type: 'text' as const },
      { name: 'hours', label: 'Hours', required: true, type: 'number' as const },
      { name: 'rate', label: 'Rate', required: true, type: 'number' as const },
      { name: 'weekEnding', label: 'Week Ending', required: true, type: 'date' as const },
      { name: 'status', label: 'Status', required: false, type: 'text' as const },
    ],
    expenses: [
      { name: 'workerName', label: 'Worker Name', required: true, type: 'text' as const },
      { name: 'clientName', label: 'Client Name', required: true, type: 'text' as const },
      { name: 'amount', label: 'Amount', required: true, type: 'number' as const },
      { name: 'category', label: 'Category', required: true, type: 'text' as const },
      { name: 'date', label: 'Date', required: true, type: 'date' as const },
      { name: 'description', label: 'Description', required: false, type: 'text' as const },
      { name: 'receiptUrl', label: 'Receipt URL', required: false, type: 'text' as const },
    ],
    workers: [
      { name: 'name', label: 'Name', required: true, type: 'text' as const },
      { name: 'email', label: 'Email', required: true, type: 'text' as const },
      { name: 'type', label: 'Type', required: true, type: 'text' as const },
      { name: 'role', label: 'Role', required: false, type: 'text' as const },
      { name: 'status', label: 'Status', required: false, type: 'text' as const },
    ],
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvData(text)
      toast.success('File loaded successfully')
    }
    reader.onerror = () => {
      toast.error('Failed to read file')
    }
    reader.readAsText(file)
  }

  const parseCsv = (data: string): { headers: string[]; rows: string[][] } => {
    const lines = data.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
    const rows = lines.slice(1).map(line => 
      line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
    )
    return { headers, rows }
  }

  const validateCsv = (data: string, type: ImportType) => {
    setIsValidating(true)
    
    setTimeout(() => {
      const errors: string[] = []
      const warnings: string[] = []
      const preview: Record<string, string>[] = []

      if (!data.trim()) {
        errors.push('No data provided')
        setValidationResult({
          valid: false,
          errors,
          warnings,
          rowCount: 0,
          preview: [],
          headers: []
        })
        setIsValidating(false)
        return
      }

      const { headers, rows } = parseCsv(data)

      if (rows.length === 0) {
        errors.push('CSV must contain at least one data row')
        setValidationResult({
          valid: false,
          errors,
          warnings,
          rowCount: 0,
          preview: [],
          headers
        })
        setIsValidating(false)
        return
      }

      const requiredFields = fieldDefinitions[type].filter(f => f.required).map(f => f.name)
      const detectedMappings: FieldMapping[] = []

      requiredFields.forEach(reqField => {
        const definition = fieldDefinitions[type].find(f => f.name === reqField)
        const matchingHeader = headers.find(h => 
          h.toLowerCase() === reqField.toLowerCase() ||
          h.toLowerCase().replace(/[_\s]/g, '') === reqField.toLowerCase().replace(/[_\s]/g, '')
        )

        if (matchingHeader) {
          detectedMappings.push({
            sourceField: matchingHeader,
            targetField: reqField,
            transform: definition?.type === 'number' ? 'number' : definition?.type === 'date' ? 'date' : 'none',
            required: true
          })
        } else {
          errors.push(`Missing required field: ${definition?.label || reqField}`)
        }
      })

      if (detectedMappings.length > 0) {
        setFieldMappings(detectedMappings)
      }

      for (let i = 0; i < Math.min(rows.length, 5); i++) {
        const row: Record<string, string> = {}
        
        headers.forEach((header, index) => {
          row[header] = rows[i][index] || ''
        })

        if (type === 'timesheets') {
          const hoursField = detectedMappings.find(m => m.targetField === 'hours')?.sourceField
          const rateField = detectedMappings.find(m => m.targetField === 'rate')?.sourceField
          
          if (hoursField) {
            const hours = parseFloat(row[hoursField])
            if (isNaN(hours) || hours <= 0) {
              errors.push(`Row ${i + 1}: Invalid hours value "${row[hoursField]}"`)
            } else if (hours > 80) {
              warnings.push(`Row ${i + 1}: Hours value ${hours} seems unusually high`)
            }
          }

          if (rateField) {
            const rate = parseFloat(row[rateField])
            if (isNaN(rate) || rate <= 0) {
              errors.push(`Row ${i + 1}: Invalid rate value "${row[rateField]}"`)
            }
          }
        }

        if (type === 'expenses') {
          const amountField = detectedMappings.find(m => m.targetField === 'amount')?.sourceField
          if (amountField) {
            const amount = parseFloat(row[amountField])
            if (isNaN(amount) || amount <= 0) {
              errors.push(`Row ${i + 1}: Invalid amount value "${row[amountField]}"`)
            }
          }
        }

        if (type === 'workers') {
          const emailField = detectedMappings.find(m => m.targetField === 'email')?.sourceField
          if (emailField && row[emailField]) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(row[emailField])) {
              errors.push(`Row ${i + 1}: Invalid email format "${row[emailField]}"`)
            }
          }
        }

        preview.push(row)
      }

      const rowCount = rows.length

      if (rowCount > 1000) {
        warnings.push(`Large import: ${rowCount} rows will be processed. This may take some time.`)
      } else if (rowCount > 500) {
        warnings.push(`Medium import: ${rowCount} rows will be processed.`)
      }

      setValidationResult({
        valid: errors.length === 0,
        errors,
        warnings,
        rowCount,
        preview,
        headers
      })
      setIsValidating(false)
    }, 500)
  }

  const transformValue = (value: string, transform: string): any => {
    switch (transform) {
      case 'uppercase':
        return value.toUpperCase()
      case 'lowercase':
        return value.toLowerCase()
      case 'number':
        return parseFloat(value) || 0
      case 'date':
        return value
      default:
        return value
    }
  }

  const handleImport = async () => {
    if (!validationResult?.valid) {
      toast.error('Cannot import data with validation errors')
      return
    }

    setIsImporting(true)
    const { headers, rows } = parseCsv(csvData)
    const progress: ImportProgress = {
      total: rows.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: []
    }

    setImportProgress(progress)

    const batchSize = 10
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, Math.min(i + batchSize, rows.length))
      
      await Promise.all(batch.map(async (row, batchIndex) => {
        try {
          const rowData: Record<string, any> = {}
          
          fieldMappings.forEach(mapping => {
            const sourceIndex = headers.indexOf(mapping.sourceField)
            if (sourceIndex >= 0) {
              rowData[mapping.targetField] = transformValue(row[sourceIndex], mapping.transform || 'none')
            }
          })

          if (activeTab === 'timesheets') {
            await createTimesheet({
              workerId: `worker-${Date.now()}`,
              workerName: rowData.workerName,
              clientName: rowData.clientName,
              hours: rowData.hours,
              rate: rowData.rate,
              amount: rowData.hours * rowData.rate,
              weekEnding: rowData.weekEnding,
              status: rowData.status || 'pending',
              submittedDate: new Date().toISOString(),
              submissionMethod: 'bulk-import'
            })
          } else if (activeTab === 'expenses') {
            await createExpense({
              workerId: `worker-${Date.now()}`,
              workerName: rowData.workerName,
              clientName: rowData.clientName,
              amount: rowData.amount,
              category: rowData.category,
              date: rowData.date,
              description: rowData.description || '',
              status: 'pending',
              currency: 'GBP',
              submittedDate: new Date().toISOString(),
              billable: true
            })
          } else if (activeTab === 'workers') {
            await createWorker({
              name: rowData.name,
              email: rowData.email,
              type: rowData.type || 'contractor',
              status: rowData.status || 'active',
              complianceStatus: 'valid'
            })
          }

          progress.succeeded++
        } catch (error) {
          progress.failed++
          progress.errors.push({
            row: i + batchIndex + 1,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        } finally {
          progress.processed++
          setImportProgress({ ...progress })
        }
      }))

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsImporting(false)
    
    if (progress.succeeded > 0) {
      toast.success(`Successfully imported ${progress.succeeded} of ${progress.total} records`)
      onImportComplete?.(rows.map((row, i) => {
        const rowData: Record<string, any> = {}
        headers.forEach((header, index) => {
          rowData[header] = row[index]
        })
        return rowData
      }))
    }

    if (progress.failed > 0) {
      toast.error(`Failed to import ${progress.failed} records. Check errors below.`)
    }
  }

  const resetImport = () => {
    setCsvData('')
    setValidationResult(null)
    setFieldMappings([])
    setImportProgress(null)
    setShowMapping(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
        <PageHeader
          title="Batch Import Manager"
          description="Import timesheets, expenses, and workers in bulk via CSV files"
        />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)}>
          <TabsList>
            <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
          </TabsList>

          {(['timesheets', 'expenses', 'workers'] as const).map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload size={20} />
                        Upload Data
                      </CardTitle>
                      <CardDescription>
                        Upload a CSV file or paste data directly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-accent transition-colors">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={`file-upload-${type}`}
                          />
                          <label
                            htmlFor={`file-upload-${type}`}
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <FileArrowUp size={32} className="text-muted-foreground" />
                            <div>
                              <p className="font-medium">Click to upload CSV file</p>
                              <p className="text-sm text-muted-foreground">or drag and drop</p>
                            </div>
                          </label>
                        </div>

                        <Separator />

                        <div>
                          <Label>Or paste CSV data</Label>
                          <Textarea
                            placeholder={`Paste CSV data here...\n\nExample:\n${sampleCsv[type]}`}
                            value={csvData}
                            onChange={(e) => setCsvData(e.target.value)}
                            rows={10}
                            className="font-mono text-xs mt-2"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="skip-header"
                            checked={skipFirstRow}
                            onCheckedChange={(checked) => setSkipFirstRow(checked as boolean)}
                          />
                          <Label htmlFor="skip-header" className="text-sm cursor-pointer">
                            First row contains headers
                          </Label>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => validateCsv(csvData, type)}
                            disabled={!csvData.trim() || isValidating}
                            className="flex-1"
                          >
                            <CheckCircle size={18} className="mr-2" />
                            {isValidating ? 'Validating...' : 'Validate Data'}
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
                          <Card className={validationResult.valid ? 'border-success' : 'border-destructive'}>
                            <CardContent className="pt-6">
                              <div className="space-y-3">
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
                                  <div>
                                    <p className="text-sm font-medium text-destructive mb-2">Errors:</p>
                                    <ScrollArea className="max-h-32">
                                      <ul className="text-sm space-y-1">
                                        {validationResult.errors.map((error, i) => (
                                          <li key={i} className="flex items-start gap-2 text-destructive">
                                            <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </ScrollArea>
                                  </div>
                                )}

                                {validationResult.warnings.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-warning mb-2">Warnings:</p>
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

                                {validationResult.valid && !showMapping && (
                                  <Button
                                    onClick={() => setShowMapping(true)}
                                    className="w-full"
                                  >
                                    <MapTrifold size={18} className="mr-2" />
                                    Configure Field Mapping
                                  </Button>
                                )}

                                {validationResult.valid && showMapping && (
                                  <Button
                                    onClick={handleImport}
                                    disabled={isImporting}
                                    className="w-full"
                                    style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                                  >
                                    <Play size={18} className="mr-2" />
                                    {isImporting ? 'Importing...' : `Import ${validationResult.rowCount} Records`}
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  onClick={resetImport}
                                  className="w-full"
                                >
                                  <X size={18} className="mr-2" />
                                  Reset
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {importProgress && (
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Import Progress</span>
                                  <span className="text-sm text-muted-foreground">
                                    {importProgress.processed} / {importProgress.total}
                                  </span>
                                </div>
                                <Progress 
                                  value={(importProgress.processed / importProgress.total) * 100}
                                />
                                <div className="flex gap-4 text-sm">
                                  <span className="text-success">✓ {importProgress.succeeded} succeeded</span>
                                  {importProgress.failed > 0 && (
                                    <span className="text-destructive">✗ {importProgress.failed} failed</span>
                                  )}
                                </div>

                                {importProgress.errors.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-destructive mb-2">Import Errors:</p>
                                    <ScrollArea className="max-h-32">
                                      <ul className="text-xs space-y-1">
                                        {importProgress.errors.map((error, i) => (
                                          <li key={i} className="text-destructive">
                                            Row {error.row}: {error.error}
                                          </li>
                                        ))}
                                      </ul>
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {showMapping && fieldMappings.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapTrifold size={20} />
                          Field Mapping
                        </CardTitle>
                        <CardDescription>
                          Configure how CSV fields map to system fields
                        </CardDescription>
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
                                onValueChange={(value) => {
                                  const newMappings = [...fieldMappings]
                                  newMappings[index].transform = value as any
                                  setFieldMappings(newMappings)
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
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
                  )}
                </div>

                <div className="space-y-6">
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
                              {fieldDefinitions[type]
                                .filter(f => f.required)
                                .map(field => (
                                  <Badge key={field.name} variant="outline">
                                    {field.label}
                                    {field.type && (
                                      <span className="ml-1 text-muted-foreground">
                                        ({field.type})
                                      </span>
                                    )}
                                  </Badge>
                                ))}
                            </div>
                          </div>

                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-3">Optional Fields</h4>
                            <div className="flex flex-wrap gap-2">
                              {fieldDefinitions[type]
                                .filter(f => !f.required)
                                .map(field => (
                                  <Badge key={field.name} variant="secondary">
                                    {field.label}
                                  </Badge>
                                ))}
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
                            Download CSV Template
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PermissionGate>
  )
}
