import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FeatureStatus, Feature, Subsection, Section, Phase, RoadmapData } from '@/hooks/useRoadmapView'

const STATUS_ICON: Record<FeatureStatus, string> = {
  completed: '✅',
  inProgress: '🔄',
  planned: '📋',
}

const STATUS_CLASS: Record<FeatureStatus, string> = {
  completed: 'text-foreground',
  inProgress: 'text-foreground font-medium',
  planned: 'text-muted-foreground',
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="space-y-2 mb-4 pl-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5">{STATUS_ICON[feature.status]}</span>
          <span className={cn(STATUS_CLASS[feature.status])}>{feature.text}</span>
        </li>
      ))}
    </ul>
  )
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 mt-4">{section.title}</h3>
      {section.features && <FeatureList features={section.features} />}
      {section.subsections?.map((sub: Subsection, i: number) => (
        <div key={i} className="mb-4">
          <h4 className="text-md font-semibold mb-2">{sub.title}</h4>
          <FeatureList features={sub.features} />
        </div>
      ))}
    </div>
  )
}

function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">{phase.title}</h2>
      {phase.sections.map(s => <SectionBlock key={s.id} section={s} />)}
      <hr className="my-6 border-border" />
    </div>
  )
}

interface Props {
  data: RoadmapData
  t: (key: string, params?: Record<string, unknown>) => string
}

export function RoadmapContent({ data, t }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-4 mt-6">{data.title}</h1>
        <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.overview')}</h2>
        <p className="text-sm text-muted-foreground mb-6">{data.overview}</p>
        <hr className="my-6 border-border" />

        {data.phases.map(phase => <PhaseBlock key={phase.id} phase={phase} />)}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.technicalInfrastructure')}</h2>
          {data.technicalInfrastructure.sections.map(s => <SectionBlock key={s.id} section={s} />)}
        </div>
        <hr className="my-6 border-border" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.legend')}</h2>
          <ul className="space-y-2 mb-4 pl-6">
            {data.legend.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5">{item.symbol}</span>
                <span><strong>{item.label}</strong>: {item.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-6 border-border" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.successMetrics')}</h2>
          {data.successMetrics.categories.map((category, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-semibold mb-2 mt-4">{category.title}</h3>
              <ul className="space-y-2 mb-4 pl-6">
                {category.metrics.map((metric, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="my-6 border-border" />

        <p className="text-sm text-muted-foreground text-center">
          <em>{t('roadmap.lastUpdated')}: {data.lastUpdated}</em><br />
          <em>{t('roadmap.version')}: {data.version}</em>
        </p>
      </CardContent>
    </Card>
  )
}
