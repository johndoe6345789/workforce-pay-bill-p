import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Download, ArrowClockwise, FileJs } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { PermissionGate } from '@/components/PermissionGate'
import { IndexedDBDemo } from '@/components/IndexedDBDemo'
import { useTranslation } from '@/hooks/use-translation'
import { useDataAdminView } from '@/hooks/useDataAdminView'
import type React from 'react'

const STORAGE_ENTITIES: { labelKey: string; kvKey: string }[] = [
  { labelKey: 'navigation.timesheets',      kvKey: 'timesheets' },
  { labelKey: 'navigation.billing',         kvKey: 'invoices' },
  { labelKey: 'navigation.payroll',         kvKey: 'payroll-runs' },
  { labelKey: 'auditTrail.entities.workers', kvKey: 'workers' },
  { labelKey: 'navigation.compliance',      kvKey: 'compliance-docs' },
  { labelKey: 'navigation.expenses',        kvKey: 'expenses' },
  { labelKey: 'navigation.rateTemplates',   kvKey: 'rate-cards' },
  { labelKey: 'billing.client',             kvKey: 'clients' },
]

const ACTION_CARDS: { Icon: React.ElementType; titleKey: string; descKey: string; infoKey: string; btnKey: string; variant?: 'destructive' | undefined; action: 'export' | 'reset' }[] = [
  { Icon: Download,       titleKey: 'dataAdmin.exportCurrentData', descKey: 'dataAdmin.exportCurrentDataDescription', infoKey: 'dataAdmin.exportDataInfo', btnKey: 'dataAdmin.exportData', action: 'export' },
  { Icon: ArrowClockwise, titleKey: 'dataAdmin.resetToDefault',    descKey: 'dataAdmin.resetToDefaultDescription',    infoKey: 'dataAdmin.resetDataInfo',   btnKey: 'dataAdmin.resetData',   variant: 'destructive', action: 'reset' },
]

const DATA_FLOW_STEPS: { titleKey: string; descKey: string }[] = [
  { titleKey: 'dataAdmin.loadFromJson',    descKey: 'dataAdmin.loadFromJsonDescription' },
  { titleKey: 'dataAdmin.storeInKv',      descKey: 'dataAdmin.storeInKvDescription' },
  { titleKey: 'dataAdmin.useInApp',       descKey: 'dataAdmin.useInAppDescription' },
  { titleKey: 'dataAdmin.persistChanges', descKey: 'dataAdmin.persistChangesDescription' },
]

export function DataAdminView() {
  const { t } = useTranslation()
  const { resetAllData, exportData, viewAllKeys } = useDataAdminView()

  const actionHandlers = { export: exportData, reset: resetAllData }

  return (
    <PermissionGate permission="settings.edit">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{t('dataAdmin.title')}</h1>
          <p className="text-muted-foreground">{t('dataAdmin.subtitle')}</p>
        </div>

        <Alert>
          <FileJs className="h-4 w-4" />
          <AlertTitle>{t('dataAdmin.jsonBasedData')}</AlertTitle>
          <AlertDescription>{t('dataAdmin.jsonBasedDataDescription')}</AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {ACTION_CARDS.map(({ Icon, titleKey, descKey, infoKey, btnKey, variant, action }) => (
            <Card key={action}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5" />{t(titleKey)}</CardTitle>
                <CardDescription>{t(descKey)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t(infoKey)}</p>
                <Button onClick={actionHandlers[action]} variant={variant} className="w-full">
                  <Icon className="mr-2 h-4 w-4" />{t(btnKey)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />{t('dataAdmin.storageInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('dataAdmin.dataEntities')}</span>
                <Badge variant="secondary">{STORAGE_ENTITIES.length}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-sm">
                {STORAGE_ENTITIES.map(({ labelKey, kvKey }) => (
                  <div key={kvKey} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t(labelKey)}</span>
                    <Badge variant="outline">{kvKey}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={viewAllKeys} variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />{t('dataAdmin.viewAllKeys')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dataAdmin.dataFlow')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DATA_FLOW_STEPS.map(({ titleKey, descKey }, i) => (
                <div key={titleKey} className="flex items-start gap-3">
                  <Badge className="mt-0.5">{i + 1}</Badge>
                  <div>
                    <p className="font-medium text-sm">{t(titleKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <IndexedDBDemo />
      </div>
    </PermissionGate>
  )
}
