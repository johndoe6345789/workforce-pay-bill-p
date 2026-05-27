import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'

const KV_KEYS = [
  'sample-data-initialized',
  'timesheets',
  'invoices',
  'payroll-runs',
  'workers',
  'compliance-docs',
  'expenses',
  'rate-cards',
  'clients',
]

const DATA_KEYS = KV_KEYS.filter(k => k !== 'sample-data-initialized')

export function useDataAdminView() {
  const { t } = useTranslation()

  const resetAllData = async () => {
    try {
      await Promise.all(KV_KEYS.map(k => window.spark.kv.delete(k)))
      toast.success(t('dataAdmin.dataClearedSuccess'), { description: t('dataAdmin.dataClearedSuccessDescription') })
    } catch {
      toast.error(t('dataAdmin.dataClearFailed'))
    }
  }

  const exportData = async () => {
    try {
      const entries = await Promise.all(DATA_KEYS.map(k => window.spark.kv.get(k)))
      const data = Object.fromEntries(DATA_KEYS.map((k, i) => [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), entries[i]]))

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workforce-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast.success(t('dataAdmin.dataExportedSuccess'), { description: t('dataAdmin.dataExportedSuccessDescription') })
    } catch {
      toast.error(t('dataAdmin.dataExportFailed'))
    }
  }

  const viewAllKeys = async () => {
    try {
      const keys = await window.spark.kv.keys()
      console.log('All KV Storage Keys:', keys)
      toast.success(t('dataAdmin.foundKeys', { count: keys.length }), { description: t('dataAdmin.foundKeysDescription') })
    } catch {
      toast.error(t('dataAdmin.keysFailed'))
    }
  }

  return { resetAllData, exportData, viewAllKeys }
}
