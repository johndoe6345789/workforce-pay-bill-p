import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, FileJs } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { PermissionGate } from '@/components/PermissionGate'
import { IndexedDBDemo } from '@/components/IndexedDBDemo'
import { DataFlowCard } from '@/components/admin/DataFlowCard'
import { useTranslation } from '@/hooks/use-translation'
import { useDataAdminView } from '@/hooks/useDataAdminView'
import { STORAGE_ENTITIES, ACTION_CARDS } from '@/data/data-admin-view-data'

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
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t(descKey)}</p>
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

        <DataFlowCard t={t} />

        <IndexedDBDemo />
      </div>
    </PermissionGate>
  )
}
