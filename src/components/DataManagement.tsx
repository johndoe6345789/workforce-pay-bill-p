import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { Database, Download, Trash, ArrowsClockwise, HardDrive } from '@phosphor-icons/react'

export function DataManagement() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadStats = async () => {
    const newStats: Record<string, number> = {}
    
    for (const [key, storeName] of Object.entries(STORES)) {
      if (key !== 'SESSIONS' && key !== 'APP_STATE') {
        try {
          const data = await indexedDB.readAll(storeName)
          newStats[storeName] = data.length
        } catch (error) {
          newStats[storeName] = 0
        }
      }
    }
    
    setStats(newStats)
  }

  useEffect(() => {
    loadStats()
  }, [])

  const resetAllData = async () => {
    setIsLoading(true)
    try {
      await indexedDB.deleteAll(STORES.TIMESHEETS)
      await indexedDB.deleteAll(STORES.INVOICES)
      await indexedDB.deleteAll(STORES.PAYROLL_RUNS)
      await indexedDB.deleteAll(STORES.WORKERS)
      await indexedDB.deleteAll(STORES.COMPLIANCE_DOCS)
      await indexedDB.deleteAll(STORES.EXPENSES)
      await indexedDB.deleteAll(STORES.RATE_CARDS)
      await indexedDB.deleteAppState('sample-data-initialized')
      
      await loadStats()
      toast.success('Data cleared - refresh to reload from JSON')
    } catch (error) {
      toast.error('Failed to clear data')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    setIsLoading(true)
    try {
      const timesheets = await indexedDB.readAll(STORES.TIMESHEETS)
      const invoices = await indexedDB.readAll(STORES.INVOICES)
      const payrollRuns = await indexedDB.readAll(STORES.PAYROLL_RUNS)
      const workers = await indexedDB.readAll(STORES.WORKERS)
      const complianceDocs = await indexedDB.readAll(STORES.COMPLIANCE_DOCS)
      const expenses = await indexedDB.readAll(STORES.EXPENSES)
      const rateCards = await indexedDB.readAll(STORES.RATE_CARDS)

      const data = {
        timesheets,
        invoices,
        payrollRuns,
        workers,
        complianceDocs,
        expenses,
        rateCards,
        exportedAt: new Date().toISOString(),
        version: 2
      }

      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workforce-indexeddb-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearStore = async (storeName: string, displayName: string) => {
    setIsLoading(true)
    try {
      await indexedDB.deleteAll(storeName)
      await loadStats()
      toast.success(`${displayName} cleared`)
    } catch (error) {
      toast.error(`Failed to clear ${displayName}`)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database size={24} className="text-primary" weight="duotone" />
            <h3 className="text-lg font-semibold">IndexedDB Data Management</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage application data stored in browser IndexedDB
          </p>
        </div>
        <Button 
          onClick={loadStats} 
          size="sm" 
          variant="ghost"
          disabled={isLoading}
        >
          <ArrowsClockwise size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <HardDrive size={16} />
          Data Stores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { store: STORES.TIMESHEETS, name: 'Timesheets' },
            { store: STORES.INVOICES, name: 'Invoices' },
            { store: STORES.PAYROLL_RUNS, name: 'Payroll Runs' },
            { store: STORES.WORKERS, name: 'Workers' },
            { store: STORES.COMPLIANCE_DOCS, name: 'Compliance Docs' },
            { store: STORES.EXPENSES, name: 'Expenses' },
            { store: STORES.RATE_CARDS, name: 'Rate Cards' },
          ].map(({ store, name }) => (
            <div 
              key={store} 
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{name}</span>
                <Badge variant="secondary">
                  {stats[store] ?? 0} records
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => clearStore(store, name)}
                disabled={isLoading || !stats[store]}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t">
        <Button 
          onClick={exportData} 
          variant="outline"
          disabled={isLoading}
        >
          <Download size={16} />
          Export All Data (JSON)
        </Button>
        <Button 
          onClick={resetAllData} 
          variant="destructive"
          disabled={isLoading}
        >
          <Trash size={16} />
          Clear All Data
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p>• <strong>Export:</strong> Download all data as JSON file</p>
        <p>• <strong>Clear All:</strong> Delete all data and reload from app-data.json</p>
        <p>• <strong>Clear Store:</strong> Delete data from specific entity store</p>
        <p>• <strong>Note:</strong> After clearing data, refresh the page to reload defaults</p>
        <p className="text-primary">• <strong>Storage:</strong> Using IndexedDB for structured data persistence</p>
      </div>
    </Card>
  )
}
