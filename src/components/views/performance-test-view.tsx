import { PageHeader } from '@/components/ui/page-header'
import { PerformanceTestPanel } from '@/components/PerformanceTestPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Flask, Info } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'

export default function PerformanceTestView() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('performanceTest.title')}
        description={t('performanceTest.subtitle')}
      />

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t('performanceTest.alertDescription')}
        </AlertDescription>
      </Alert>

      <PerformanceTestPanel />

      <Card>
        <CardHeader>
          <CardTitle>{t('performanceTest.optimizationFeatures')}</CardTitle>
          <CardDescription>
            {t('performanceTest.optimizationFeaturesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.virtualScrolling')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.virtualScrollingDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.adaptivePolling')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.adaptivePollingDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.memoizedComponents')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.memoizedComponentsDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.lazyLoading')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.lazyLoadingDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.indexedDB')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.indexedDBDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('performanceTest.debouncing')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('performanceTest.debouncingDescription')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
