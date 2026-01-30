import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Database, Download, ArrowClockwise, FileJs } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { PermissionGate } from '@/components/PermissionGate'
import { IndexedDBDemo } from '@/components/IndexedDBDemo'
import { useTranslation } from '@/hooks/use-translation'

export function DataAdminView() {
  const { t } = useTranslation()

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

      toast.success(t('dataAdmin.dataClearedSuccess'), {
        description: t('dataAdmin.dataClearedSuccessDescription')
      })
    } catch (error) {
      toast.error(t('dataAdmin.dataClearFailed'))
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

      toast.success(t('dataAdmin.dataExportedSuccess'), {
        description: t('dataAdmin.dataExportedSuccessDescription')
      })
    } catch (error) {
      toast.error(t('dataAdmin.dataExportFailed'))
    }
  }

  const viewAllKeys = async () => {
    try {
      const keys = await window.spark.kv.keys()
      console.log('All KV Storage Keys:', keys)
      toast.success(t('dataAdmin.foundKeys', { count: keys.length }), {
        description: t('dataAdmin.foundKeysDescription')
      })
    } catch (error) {
      toast.error(t('dataAdmin.keysFailed'))
    }
  }

  return (
    <PermissionGate permission="settings.edit">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{t('dataAdmin.title')}</h1>
          <p className="text-muted-foreground">
            {t('dataAdmin.subtitle')}
          </p>
        </div>

        <Alert>
          <FileJs className="h-4 w-4" />
          <AlertTitle>{t('dataAdmin.jsonBasedData')}</AlertTitle>
          <AlertDescription>
            {t('dataAdmin.jsonBasedDataDescription')}
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('dataAdmin.exportCurrentData')}
            </CardTitle>
            <CardDescription>
              {t('dataAdmin.exportCurrentDataDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('dataAdmin.exportDataInfo')}
            </p>
            <Button onClick={exportData} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {t('dataAdmin.exportData')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowClockwise className="h-5 w-5" />
              {t('dataAdmin.resetToDefault')}
            </CardTitle>
            <CardDescription>
              {t('dataAdmin.resetToDefaultDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('dataAdmin.resetDataInfo')}
            </p>
            <Button onClick={resetAllData} variant="destructive" className="w-full">
              <ArrowClockwise className="mr-2 h-4 w-4" />
              {t('dataAdmin.resetData')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('dataAdmin.storageInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('dataAdmin.dataEntities')}</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.timesheets')}</span>
                <Badge variant="outline">timesheets</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.invoices')}</span>
                <Badge variant="outline">invoices</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.payrollRuns')}</span>
                <Badge variant="outline">payroll-runs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.workers')}</span>
                <Badge variant="outline">workers</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.complianceDocs')}</span>
                <Badge variant="outline">compliance-docs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.expenses')}</span>
                <Badge variant="outline">expenses</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.rateCards')}</span>
                <Badge variant="outline">rate-cards</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('dataAdmin.clients')}</span>
                <Badge variant="outline">clients</Badge>
              </div>
            </div>
          </div>
          <Button onClick={viewAllKeys} variant="outline" className="w-full">
            <Database className="mr-2 h-4 w-4" />
            {t('dataAdmin.viewAllKeys')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('dataAdmin.dataFlow')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium text-sm">{t('dataAdmin.loadFromJson')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dataAdmin.loadFromJsonDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium text-sm">{t('dataAdmin.storeInKv')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dataAdmin.storeInKvDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium text-sm">{t('dataAdmin.useInApp')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dataAdmin.useInAppDescription')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium text-sm">{t('dataAdmin.persistChanges')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dataAdmin.persistChangesDescription')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <IndexedDBDemo />
      </div>
    </PermissionGate>
  )
}
