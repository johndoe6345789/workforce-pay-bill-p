import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { useAppSelector } from '@/store/hooks'
import { calculateTranslationCoverage } from '@/lib/translation-coverage'

export type FeatureStatus = 'completed' | 'inProgress' | 'planned'

export interface Feature { status: FeatureStatus; text: string }
export interface Subsection { title: string; features: Feature[] }
export interface Section { id: string; title: string; features?: Feature[]; subsections?: Subsection[] }
export interface Phase { id: string; title: string; sections: Section[] }
export interface RoadmapData {
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
  releaseCadence: { major: string; minor: string; patches: string; hotfixes: string }
  phases: Phase[]
  technicalInfrastructure: { title: string; sections: Section[] }
  successMetrics: { title: string; categories: Array<{ title: string; metrics: string[] }> }
  legend: Array<{ symbol: string; label: string; description: string }>
}

export function useRoadmapView() {
  const { t } = useTranslation()
  const locale = useAppSelector(state => state.ui.locale)
  const [data, setData] = useState<RoadmapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const translationCoverage = calculateTranslationCoverage()

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setIsLoading(true)
        let mod
        if (locale === 'fr') mod = await import('@/data/roadmap.fr.json')
        else if (locale === 'es') mod = await import('@/data/roadmap.es.json')
        else mod = await import('@/data/roadmap.json')
        setData((mod.default || mod) as RoadmapData)
      } catch (err) {
        console.error(`Failed to load roadmap for locale: ${locale}`, err)
        const fallback = await import('@/data/roadmap.json')
        setData((fallback.default || fallback) as RoadmapData)
      } finally {
        setIsLoading(false)
      }
    }
    loadRoadmap()
  }, [locale])

  return { t, data, isLoading, translationCoverage }
}
