import { cn } from '@/lib/utils'
import type { FeatureStatus, Feature, Subsection, Section, Phase } from '@/hooks/useRoadmapView'

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

export function FeatureList({ features }: { features: Feature[] }) {
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

export function SectionBlock({ section }: { section: Section }) {
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

export function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">{phase.title}</h2>
      {phase.sections.map(s => <SectionBlock key={s.id} section={s} />)}
      <hr className="my-6 border-border" />
    </div>
  )
}
