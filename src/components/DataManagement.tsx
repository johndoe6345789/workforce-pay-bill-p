import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Download, Trash, ArrowsClockwise, HardDrive } from '@phosphor-icons/react'
import { STORES } from '@/lib/indexed-db'
import { useDataManagement } from '@/hooks/useDataManagement'

const STORE_ENTRIES = [
  { store: STORES.TIMESHEETS,     name: 'Timesheets' },
  { store: STORES.INVOICES,       name: 'Invoices' },
  { store: STORES.PAYROLL_RUNS,   name: 'Payroll Runs' },
  { store: STORES.WORKERS,        name: 'Workers' },
  { store: STORES.COMPLIANCE_DOCS, name: 'Compliance Docs' },
  { store: STORES.EXPENSES,       name: 'Expenses' },
  { store: STORES.RATE_CARDS,     name: 'Rate Cards' },
]

const NOTES = [
  { label: 'Export', desc: 'Download all data as JSON file' },
  { label: 'Clear All', desc: 'Delete all data and reload from app-data.json' },
  { label: 'Clear Store', desc: 'Delete data from specific entity store' },
  { label: 'Note', desc: 'After clearing data, refresh the page to reload defaults' },
  { label: 'Storage', desc: 'Using IndexedDB for structured data persistence', primary: true },
]

export function DataManagement() {
  const { stats, isLoading, loadStats, resetAllData, exportData, clearStore } = useDataManagement()

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database size={24} className="text-primary" weight="duotone" />
            <h3 className="text-lg font-semibold">IndexedDB Data Management</h3>
          </div>
          <p className="text-sm text-muted-foreground">Manage application data stored in browser IndexedDB</p>
        </div>
        <Button onClick={loadStats} size="sm" variant="ghost" disabled={isLoading}>
          <ArrowsClockwise size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2"><HardDrive size={16} />Data Stores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STORE_ENTRIES.map(({ store, name }) => (
            <div key={store} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{name}</span>
                <Badge variant="secondary">{stats[store] ?? 0} records</Badge>
              </div>
              <Button size="sm" variant="ghost" onClick={() => clearStore(store, name)} disabled={isLoading || !stats[store]}>
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t">
        <Button onClick={exportData} variant="outline" disabled={isLoading}>
          <Download size={16} />Export All Data (JSON)
        </Button>
        <Button onClick={resetAllData} variant="destructive" disabled={isLoading}>
          <Trash size={16} />Clear All Data
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        {NOTES.map(({ label, desc, primary }) => (
          <p key={label} className={primary ? 'text-primary' : ''}>
            • <strong>{label}:</strong> {desc}
          </p>
        ))}
      </div>
    </Card>
  )
}
