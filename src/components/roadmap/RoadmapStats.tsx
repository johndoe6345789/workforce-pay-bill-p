import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ClockCounterClockwise, MapTrifold, Translate } from '@phosphor-icons/react'
import type { RoadmapData } from '@/hooks/useRoadmapView'

interface TranslationCoverage {
  percentage: number
  translatedPages: number
  totalPages: number
  pagesWithoutTranslations: string[]
}

interface Props {
  stats: RoadmapData['stats']
  translationCoverage: TranslationCoverage
  t: (key: string, params?: Record<string, unknown>) => string
}

const STAT_CARDS = [
  { borderColor: 'border-success/20', Icon: CheckCircle, iconColor: 'text-success', titleKey: 'roadmap.completedFeatures', statKey: 'completedFeatures' as const, descKey: 'completedDescription' as const },
  { borderColor: 'border-accent/20', Icon: CheckCircle, iconColor: 'text-accent', titleKey: 'roadmap.componentLibrary', statKey: 'componentLibrary' as const, descKey: 'componentDescription' as const },
  { borderColor: 'border-warning/20', Icon: ClockCounterClockwise, iconColor: 'text-warning', titleKey: 'roadmap.currentFocus', statKey: 'currentFocus' as const, descKey: 'currentDescription' as const },
  { borderColor: 'border-accent/20', Icon: MapTrifold, iconColor: 'text-accent', titleKey: 'roadmap.totalPhases', statKey: 'totalPhases' as const, descKey: 'phaseDescription' as const },
]

export function RoadmapStats({ stats, translationCoverage, t }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {STAT_CARDS.map(({ borderColor, Icon, iconColor, titleKey, statKey, descKey }) => (
        <Card key={statKey} className={`border-l-4 ${borderColor}`}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon size={18} className={iconColor} weight="fill" />{t(titleKey)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats[statKey]}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats[descKey]}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="border-l-4 border-info/20">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Translate size={18} className="text-info" weight="fill" />{t('roadmap.translationCoverage')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{translationCoverage.percentage}%</div>
          <p className="text-sm text-muted-foreground mt-1">{translationCoverage.translatedPages}/{translationCoverage.totalPages} {t('roadmap.pagesTranslated')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
