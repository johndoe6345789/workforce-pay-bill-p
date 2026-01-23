import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export function DataManagement() {
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
      
      toast.success('Data cleared - refresh to reload from JSON')
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

      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Data Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage application data and reset to defaults
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={exportData} variant="outline">
          Export Current Data
        </Button>
        <Button onClick={resetAllData} variant="destructive">
          Reset to Default Data
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Export: Download current data as JSON file</p>
        <p>• Reset: Clear all data and reload from app-data.json</p>
        <p>• After reset, refresh the page to see changes</p>
      </div>
    </Card>
  )
}
