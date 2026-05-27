import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { indexedDB, STORES } from '@/lib/indexed-db'

const DATA_STORES = [
  STORES.TIMESHEETS,
  STORES.INVOICES,
  STORES.PAYROLL_RUNS,
  STORES.WORKERS,
  STORES.COMPLIANCE_DOCS,
  STORES.EXPENSES,
  STORES.RATE_CARDS,
]

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useDataManagement() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadStats = async () => {
    const next: Record<string, number> = {}
    for (const store of DATA_STORES) {
      try { next[store] = (await indexedDB.readAll(store)).length }
      catch { next[store] = 0 }
    }
    setStats(next)
  }

  useEffect(() => { loadStats() }, [])

  const withLoading = async (fn: () => Promise<void>) => {
    setIsLoading(true)
    try { await fn() }
    finally { setIsLoading(false) }
  }

  const resetAllData = () => withLoading(async () => {
    await Promise.all(DATA_STORES.map(s => indexedDB.deleteAll(s)))
    await indexedDB.deleteAppState('sample-data-initialized')
    await loadStats()
    toast.success('Data cleared - refresh to reload from JSON')
  })

  const exportData = () => withLoading(async () => {
    const entries = await Promise.all(DATA_STORES.map(s => indexedDB.readAll(s)))
    const data = {
      timesheets: entries[0], invoices: entries[1], payrollRuns: entries[2],
      workers: entries[3], complianceDocs: entries[4], expenses: entries[5], rateCards: entries[6],
      exportedAt: new Date().toISOString(),
      version: 2,
    }
    downloadJson(data, `workforce-indexeddb-export-${new Date().toISOString().split('T')[0]}.json`)
    toast.success('Data exported successfully')
  })

  const clearStore = (storeName: string, displayName: string) => withLoading(async () => {
    await indexedDB.deleteAll(storeName)
    await loadStats()
    toast.success(`${displayName} cleared`)
  })

  return { stats, isLoading, loadStats, resetAllData, exportData, clearStore }
}
