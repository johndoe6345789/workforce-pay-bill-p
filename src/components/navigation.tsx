import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  ChartBar,
  Buildings,
  MapTrifold,
  Question,
  PuzzlePiece,
  Code,
  Database,
  SignOut
} from '@phosphor-icons/react'
import { NavItem } from '@/components/nav/NavItem'
import { CoreOperationsNav, ReportsNav, ConfigurationNav, ToolsNav } from '@/components/nav/nav-sections'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import type { View } from '@/App'
import type { DashboardMetrics } from '@/lib/types'

interface SidebarProps {
  currentView: View
  setCurrentView: (view: View) => void
  currentEntity: string
  setCurrentEntity: (entity: string) => void
  metrics: DashboardMetrics
}

export function Sidebar({ currentView, setCurrentView, currentEntity, setCurrentEntity, metrics }: SidebarProps) {
  const { t } = useTranslation()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core']))
  const { user, logout } = useAuth()
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col" role="navigation" aria-label="Main navigation">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight">{t('app.title')}</h1>
        <p className="text-xs text-muted-foreground mt-1">{t('sidebar.backOfficePlatform')}</p>
      </div>

      <div className="p-4 border-b border-border">
        <Select value={currentEntity} onValueChange={setCurrentEntity}>
          <SelectTrigger className="w-full" aria-label={t('sidebar.selectEntity')}>
            <div className="flex items-center gap-2">
              <Buildings size={16} weight="fill" className="text-primary" aria-hidden="true" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Main Agency">Main Agency</SelectItem>
            <SelectItem value="North Division">North Division</SelectItem>
            <SelectItem value="South Division">South Division</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Application sections">
        <NavItem
          icon={<ChartBar size={20} />}
          label={t('navigation.dashboard')}
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
          view="dashboard"
        />
        
        <CoreOperationsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          metrics={metrics}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />

        <ReportsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />

        <ConfigurationNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />

        <ToolsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />

        <Separator className="my-2" role="separator" />
        <NavItem
          icon={<PuzzlePiece size={20} />}
          label={t('sidebar.componentLibrary')}
          active={currentView === 'component-showcase'}
          onClick={() => setCurrentView('component-showcase')}
          view="component-showcase"
        />
        <NavItem
          icon={<Code size={20} />}
          label={t('sidebar.businessLogicHooks')}
          active={currentView === 'business-logic-demo'}
          onClick={() => setCurrentView('business-logic-demo')}
          view="business-logic-demo"
        />
        <NavItem
          icon={<Database size={20} />}
          label={t('navigation.dataAdmin')}
          active={currentView === 'data-admin'}
          onClick={() => setCurrentView('data-admin')}
          view="data-admin"
          permission="settings.edit"
        />
        <NavItem
          icon={<Question size={20} />}
          label={t('navigation.queryGuide')}
          active={currentView === 'query-guide'}
          onClick={() => setCurrentView('query-guide')}
          view="query-guide"
        />
        <NavItem
          icon={<MapTrifold size={20} />}
          label={t('navigation.roadmap')}
          active={currentView === 'roadmap'}
          onClick={() => setCurrentView('roadmap')}
          view="roadmap"
        />
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <button
          onClick={() => setCurrentView('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={`View profile for ${user?.name || 'User'}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium" aria-hidden="true">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
        </button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={logout}
          aria-label={t('sidebar.logOutOfApplication')}
        >
          <SignOut size={16} aria-hidden="true" />
          {t('sidebar.logOut')}
        </Button>
      </div>
    </aside>
  )
}
