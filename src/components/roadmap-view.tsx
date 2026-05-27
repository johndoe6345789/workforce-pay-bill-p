import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapTrifold, Warning, Download, Translate } from '@phosphor-icons/react'
import { useRoadmapView } from '@/hooks/useRoadmapView'
import { RoadmapStats } from '@/components/roadmap/RoadmapStats'
import { RoadmapContent } from '@/components/roadmap/RoadmapContent'

export function RoadmapView() {
  const { t, data, isLoading, translationCoverage } = useRoadmapView()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MapTrifold size={48} className="mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('roadmap.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('roadmap.subtitle')}</p>
        </div>
        <Button variant="outline">
          <Download size={18} className="mr-2" />{t('roadmap.downloadPDF')}
        </Button>
      </div>

      <RoadmapStats stats={data.stats} translationCoverage={translationCoverage} t={t} />

      <RoadmapContent data={data} t={t} />

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Warning size={20} className="text-warning" />{t('roadmap.releaseCadence')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground">{t('roadmap.majorReleases')}</p><p className="font-medium">{data.releaseCadence.major}</p></div>
            <div><p className="text-muted-foreground">{t('roadmap.minorUpdates')}</p><p className="font-medium">{data.releaseCadence.minor}</p></div>
            <div><p className="text-muted-foreground">{t('roadmap.patches')}</p><p className="font-medium">{data.releaseCadence.patches}</p></div>
            <div><p className="text-muted-foreground">{t('roadmap.hotfixes')}</p><p className="font-medium">{data.releaseCadence.hotfixes}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-warning/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Translate size={20} className="text-warning" />{t('roadmap.pagesWithoutTranslations')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('roadmap.pagesWithoutTranslationsDescription')} ({translationCoverage.pagesWithoutTranslations.length} {t('roadmap.remaining')})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {translationCoverage.pagesWithoutTranslations.map((page, i) => (
              <div key={i} className="text-xs font-mono bg-background/50 px-3 py-2 rounded-md border border-border">{page}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
