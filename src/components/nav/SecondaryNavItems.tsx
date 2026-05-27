import { Question, PuzzlePiece, Code, Database, MapTrifold } from '@phosphor-icons/react'
import { NavItem } from '@/components/nav/NavItem'
import { useTranslation } from '@/hooks/use-translation'
import type { View } from '@/App'

interface Props {
  currentView: View
  setCurrentView: (view: View) => void
}

const ITEMS = [
  { icon: PuzzlePiece, labelKey: 'sidebar.componentLibrary', view: 'component-showcase' as View },
  { icon: Code, labelKey: 'sidebar.businessLogicHooks', view: 'business-logic-demo' as View },
  { icon: Database, labelKey: 'navigation.dataAdmin', view: 'data-admin' as View, permission: 'settings.edit' },
  { icon: Question, labelKey: 'navigation.queryGuide', view: 'query-guide' as View },
  { icon: MapTrifold, labelKey: 'navigation.roadmap', view: 'roadmap' as View },
]

/** Secondary nav items below the main nav groups. */
export function SecondaryNavItems({ currentView, setCurrentView }: Props) {
  const { t } = useTranslation()
  return (
    <>
      {ITEMS.map(({ icon: Icon, labelKey, view, permission }) => (
        <NavItem
          key={view}
          icon={<Icon size={20} />}
          label={t(labelKey)}
          active={currentView === view}
          onClick={() => setCurrentView(view)}
          view={view}
          permission={permission}
        />
      ))}
    </>
  )
}
