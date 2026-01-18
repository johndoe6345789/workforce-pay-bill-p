import { useState } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Warning, Download } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ImportResult {
  id: string
  timestamp: string
  source: string
  recordsProcessed: number
  recordsSuccessful: number
  recordsFailed: number
  status: 'success' | 'partial' | 'failed'
  errors?: string[]
}

interface BatchImportManagerProps {
  onImportComplete: (data: any[]) => void
}

export function BatchImportManager({ onImportComplete }: BatchImportManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importSource, setImportSource] = useState<'csv' | 'json' | 'xml' | 'api'>('csv')
  const [importData, setImportData] = useState('')
  const [importHistory, setImportHistory] = useState<ImportResult[]>([])

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error('Please provide data to import')
      return
    }

    let parsedData: any[] = []
    let errors: string[] = []
    let successCount = 0

    try {
      if (importSource === 'csv') {
        const lines = importData.trim().split('\n')
        if (lines.length < 2) {
          toast.error('CSV must have at least a header and one data row')
          return
        }

        const headers = lines[0].split(',').map(h => h.trim())
        
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = lines[i].split(',').map(v => v.trim())
            if (values.length !== headers.length) {
              errors.push(`Row ${i}: Column count mismatch`)
              continue
            }

            const record: any = {}
            headers.forEach((header, idx) => {
              record[header] = values[idx]
            })

            parsedData.push(record)
            successCount++
          } catch (err) {
            errors.push(`Row ${i}: ${err instanceof Error ? err.message : 'Parse error'}`)
          }
        }
      } else if (importSource === 'json') {
        const parsed = JSON.parse(importData)
        parsedData = Array.isArray(parsed) ? parsed : [parsed]
        successCount = parsedData.length
      } else if (importSource === 'xml') {
        toast.error('XML import not yet implemented')
        return
      } else if (importSource === 'api') {
        toast.error('API import not yet implemented')
        return
      }

      const result: ImportResult = {
        id: `IMP-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: importSource.toUpperCase(),
        recordsProcessed: parsedData.length + errors.length,
        recordsSuccessful: successCount,
        recordsFailed: errors.length,
        status: errors.length === 0 ? 'success' : successCount > 0 ? 'partial' : 'failed',
        errors: errors.length > 0 ? errors : undefined
      }

      setImportHistory(prev => [result, ...prev])

      if (parsedData.length > 0) {
        onImportComplete(parsedData)
        toast.success(`Successfully imported ${successCount} records${errors.length > 0 ? ` (${errors.length} failed)` : ''}`)
      } else {
        toast.error('No records were successfully imported')
      }

      setImportData('')
      if (errors.length === 0) {
        setIsOpen(false)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed')
    }
  }

  const downloadTemplate = () => {
    const template = importSource === 'csv' 
      ? 'workerName,clientName,hours,rate,weekEnding\nJohn Doe,Acme Corp,40,25.50,2025-01-17'
      : importSource === 'json'
      ? JSON.stringify([{ workerName: 'John Doe', clientName: 'Acme Corp', hours: 40, rate: 25.50, weekEnding: '2025-01-17' }], null, 2)
      : ''

    const blob = new Blob([template], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template.${importSource}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Template downloaded')
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload size={18} className="mr-2" />
            Batch Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Batch Import Manager</DialogTitle>
            <DialogDescription>
              Import timesheets, expenses, or workers from external systems
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="import" className="mt-4">
            <TabsList>
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="history">Import History ({importHistory.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-source">Import Source</Label>
                <Select value={importSource} onValueChange={(v: any) => setImportSource(v)}>
                  <SelectTrigger id="import-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="xml">XML (Coming Soon)</SelectItem>
                    <SelectItem value="api">API Connection (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Paste your {importSource.toUpperCase()} data below or download a template to get started
                </p>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download size={16} className="mr-2" />
                  Download Template
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="import-data">Import Data</Label>
                <Textarea
                  id="import-data"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={importSource === 'csv' 
                    ? 'workerName,clientName,hours,rate,weekEnding\nJohn Doe,Acme Corp,40,25.50,2025-01-17'
                    : importSource === 'json'
                    ? '[{"workerName": "John Doe", "clientName": "Acme Corp", "hours": 40, "rate": 25.50, "weekEnding": "2025-01-17"}]'
                    : 'Paste your data here...'}
                  rows={12}
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleImport}>Import Records</Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              {importHistory.length === 0 ? (
                <Card className="p-12 text-center">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No import history yet</p>
                </Card>
              ) : (
                importHistory.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            {result.status === 'success' && <CheckCircle size={20} className="text-success" weight="fill" />}
                            {result.status === 'partial' && <Warning size={20} className="text-warning" weight="fill" />}
                            {result.status === 'failed' && <XCircle size={20} className="text-destructive" weight="fill" />}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{result.id}</p>
                                <Badge variant={result.status === 'success' ? 'success' : result.status === 'partial' ? 'warning' : 'destructive'}>
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(result.timestamp).toLocaleString()} • {result.source}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Processed</p>
                              <p className="font-medium font-mono">{result.recordsProcessed}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Successful</p>
                              <p className="font-medium font-mono text-success">{result.recordsSuccessful}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Failed</p>
                              <p className="font-medium font-mono text-destructive">{result.recordsFailed}</p>
                            </div>
                          </div>
                          {result.errors && result.errors.length > 0 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View {result.errors.length} error(s)
                              </summary>
                              <ul className="mt-2 space-y-1 pl-4">
                                {result.errors.slice(0, 5).map((error, idx) => (
                                  <li key={idx} className="text-destructive">{error}</li>
                                ))}
                                {result.errors.length > 5 && (
                                  <li className="text-muted-foreground">...and {result.errors.length - 5} more</li>
                                )}
                              </ul>
                            </details>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
