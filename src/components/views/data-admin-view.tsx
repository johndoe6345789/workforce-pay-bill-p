import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Database, Download, ArrowClockwise, FileJs } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { PermissionGate } from '@/components/PermissionGate'

export function DataAdminView() {
  const resetAllData = async () => {
    try {
      await window.spark.kv.delete('sample-data-initialized')
      await window.spark.kv.delete('timesheets')
      await window.spark.kv.delete('invoices')
      await window.spark.kv.delete('payroll-runs')
      await window.spark.kv.delete('workers')
      await window.spark.kv.delete('compliance-docs')
      await window.spark.kv.delete('expenses')
      await window.spark.kv.delete('rate-cards')
      await window.spark.kv.delete('clients')
      
      toast.success('Data cleared successfully', {
        description: 'Refresh the page to reload default data from JSON'
      })
    } catch (error) {
      toast.error('Failed to clear data')
    }
  }

  const exportData = async () => {
    try {
      const timesheets = await window.spark.kv.get('timesheets')
      const invoices = await window.spark.kv.get('invoices')
      const payrollRuns = await window.spark.kv.get('payroll-runs')
      const workers = await window.spark.kv.get('workers')
      const complianceDocs = await window.spark.kv.get('compliance-docs')
      const expenses = await window.spark.kv.get('expenses')
      const rateCards = await window.spark.kv.get('rate-cards')
      const clients = await window.spark.kv.get('clients')

      const data = {
        timesheets,
        invoices,
        payrollRuns,
        workers,
        complianceDocs,
        expenses,
        rateCards,
        clients
      }

      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workforce-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully', {
        description: 'Your data has been downloaded as a JSON file'
      })
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const viewAllKeys = async () => {
    try {
      const keys = await window.spark.kv.keys()
      console.log('All KV Storage Keys:', keys)
      toast.success(`Found ${keys.length} keys`, {
        description: 'Check the console for full list'
      })
    } catch (error) {
      toast.error('Failed to retrieve keys')
    }
  }

  return (
    <PermissionGate permission="settings.edit">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Data Administration</h1>
          <p className="text-muted-foreground">
            Manage application data loaded from JSON files
          </p>
        </div>

        <Alert>
          <FileJs className="h-4 w-4" />
          <AlertTitle>JSON-Based Data</AlertTitle>
          <AlertDescription>
            All application data is loaded from <code className="px-1 py-0.5 bg-muted rounded text-xs">/src/data/app-data.json</code> into persistent KV storage.
            Changes you make in the app are saved to KV storage and persist between sessions.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Current Data
            </CardTitle>
            <CardDescription>
              Download all current data as a JSON file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will export all data currently in KV storage, including any modifications you've made.
            </p>
            <Button onClick={exportData} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowClockwise className="h-5 w-5" />
              Reset to Default Data
            </CardTitle>
            <CardDescription>
              Clear all data and reload from JSON file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will delete all data from KV storage. Refresh the page to reload the default data from app-data.json.
            </p>
            <Button onClick={resetAllData} variant="destructive" className="w-full">
              <ArrowClockwise className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Entities</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Timesheets</span>
                <Badge variant="outline">timesheets</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoices</span>
                <Badge variant="outline">invoices</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payroll Runs</span>
                <Badge variant="outline">payroll-runs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workers</span>
                <Badge variant="outline">workers</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Compliance</span>
                <Badge variant="outline">compliance-docs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expenses</span>
                <Badge variant="outline">expenses</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rate Cards</span>
                <Badge variant="outline">rate-cards</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Clients</span>
                <Badge variant="outline">clients</Badge>
              </div>
            </div>
          </div>
          <Button onClick={viewAllKeys} variant="outline" className="w-full">
            <Database className="mr-2 h-4 w-4" />
            View All Keys (Console)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium text-sm">Load from JSON</p>
                <p className="text-xs text-muted-foreground">
                  On first load, data is read from <code>/src/data/app-data.json</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium text-sm">Store in KV</p>
                <p className="text-xs text-muted-foreground">
                  Data is written to persistent KV storage
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium text-sm">Use in App</p>
                <p className="text-xs text-muted-foreground">
                  Components read from and write to KV storage via hooks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium text-sm">Persist Changes</p>
                <p className="text-xs text-muted-foreground">
                  All changes persist between sessions automatically
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </PermissionGate>
  )
}
