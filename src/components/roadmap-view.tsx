import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ClockCounterClockwise, MapTrifold, Warning, Download } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import roadmapData from '@/data/roadmap.json'
import { useTranslation } from '@/hooks/use-translation'

type FeatureStatus = 'completed' | 'inProgress' | 'planned'

interface Feature {
  status: FeatureStatus
  text: string
}

interface Subsection {
  title: string
  features: Feature[]
}

interface Section {
  id: string
  title: string
  features?: Feature[]
  subsections?: Subsection[]
}

interface Phase {
  id: string
  title: string
  sections: Section[]
}

interface RoadmapData {
  title: string
  version: string
  lastUpdated: string
  overview: string
  stats: {
    completedFeatures: string
    completedDescription: string
    componentLibrary: string
    componentDescription: string
    currentFocus: string
    currentDescription: string
    totalPhases: string
    phaseDescription: string
  }
  releaseCadence: {
    major: string
    minor: string
    patches: string
    hotfixes: string
  }
  phases: Phase[]
  technicalInfrastructure: {
    title: string
    sections: Section[]
  }
  successMetrics: {
    title: string
    categories: Array<{
      title: string
      metrics: string[]
    }>
  }
  legend: Array<{
    symbol: string
    label: string
    description: string
  }>
}

export function RoadmapView() {
  const [data] = useState<RoadmapData>(roadmapData as RoadmapData)
  const { t } = useTranslation()

  const getStatusIcon = (status: FeatureStatus) => {
    switch (status) {
      case 'completed':
        return <span className="text-success">✅</span>
      case 'inProgress':
        return <span className="text-warning">🔄</span>
      case 'planned':
        return <span className="text-muted-foreground">📋</span>
    }
  }

  const getStatusClass = (status: FeatureStatus) => {
    switch (status) {
      case 'completed':
        return 'text-foreground'
      case 'inProgress':
        return 'text-foreground font-medium'
      case 'planned':
        return 'text-muted-foreground'
    }
  }

  const renderFeatureList = (features: Feature[]) => (
    <ul className="space-y-2 mb-4 pl-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5">{getStatusIcon(feature.status)}</span>
          <span className={cn(getStatusClass(feature.status))}>
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  )

  const renderSection = (section: Section) => (
    <div key={section.id} className="mb-6">
      <h3 className="text-lg font-semibold mb-2 mt-4">{section.title}</h3>
      {section.features && renderFeatureList(section.features)}
      {section.subsections?.map((subsection, i) => (
        <div key={i} className="mb-4">
          <h4 className="text-md font-semibold mb-2">{subsection.title}</h4>
          {renderFeatureList(subsection.features)}
        </div>
      ))}
    </div>
  )

  const renderPhase = (phase: Phase) => (
    <div key={phase.id} className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">
        {phase.title}
      </h2>
      {phase.sections.map(renderSection)}
      <hr className="my-6 border-border" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('roadmap.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('roadmap.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            {t('roadmap.downloadPDF')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-success" weight="fill" />
              {t('roadmap.completedFeatures')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.stats.completedFeatures}</div>
            <p className="text-sm text-muted-foreground mt-1">{data.stats.completedDescription}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-accent" weight="fill" />
              {t('roadmap.componentLibrary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.stats.componentLibrary}</div>
            <p className="text-sm text-muted-foreground mt-1">{data.stats.componentDescription}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-warning" weight="fill" />
              {t('roadmap.currentFocus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.stats.currentFocus}</div>
            <p className="text-sm text-muted-foreground mt-1">{data.stats.currentDescription}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <MapTrifold size={18} className="text-accent" weight="fill" />
              {t('roadmap.totalPhases')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.stats.totalPhases}</div>
            <p className="text-sm text-muted-foreground mt-1">{data.stats.phaseDescription}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-semibold tracking-tight mb-4 mt-6">{data.title}</h1>
          
          <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.overview')}</h2>
          <p className="text-sm text-muted-foreground mb-6">{data.overview}</p>
          
          <hr className="my-6 border-border" />
          
          {data.phases.map(renderPhase)}
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">
              {t('roadmap.technicalInfrastructure')}
            </h2>
            {data.technicalInfrastructure.sections.map(renderSection)}
          </div>

          <hr className="my-6 border-border" />

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-3 mt-6">{t('roadmap.legend')}</h2>
            <ul className="space-y-2 mb-4 pl-6">
              {data.legend.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5">{item.symbol}</span>
                  <span>
                    <strong>{item.label}</strong>: {item.description}
                  </span>
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
            <em>{t('roadmap.lastUpdated')}: {data.lastUpdated}</em>
            <br />
            <em>{t('roadmap.version')}: {data.version}</em>
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Warning size={20} className="text-warning" />
            {t('roadmap.releaseCadence')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t('roadmap.majorReleases')}</p>
              <p className="font-medium">{data.releaseCadence.major}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('roadmap.minorUpdates')}</p>
              <p className="font-medium">{data.releaseCadence.minor}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('roadmap.patches')}</p>
              <p className="font-medium">{data.releaseCadence.patches}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('roadmap.hotfixes')}</p>
              <p className="font-medium">{data.releaseCadence.hotfixes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
