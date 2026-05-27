import { Separator } from '@/components/ui/separator'
import { ChartBar } from '@phosphor-icons/react'
import { NavItem } from '@/components/nav/NavItem'
import { CoreOperationsNav, ReportsNav, ConfigurationNav, ToolsNav } from '@/components/nav/nav-sections'
import { SidebarEntitySelector } from '@/components/nav/SidebarEntitySelector'
import { SidebarUserPanel } from '@/components/nav/SidebarUserPanel'
import { SecondaryNavItems } from '@/components/nav/SecondaryNavItems'
import { useSidebar } from '@/hooks/useSidebar'
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
  const vm = useSidebar(currentEntity)

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col" role="navigation" aria-label="Main navigation">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight">{vm.t('app.title')}</h1>
        <p className="text-xs text-muted-foreground mt-1">{vm.t('sidebar.backOfficePlatform')}</p>
      </div>

      <SidebarEntitySelector
        currentEntity={currentEntity}
        entityLabel={vm.entityLabel}
        onEntityChange={setCurrentEntity}
      />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Application sections">
        <NavItem
          icon={<ChartBar size={20} />}
          label={vm.t('navigation.dashboard')}
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
          view="dashboard"
        />
        <CoreOperationsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          metrics={metrics}
          expandedGroups={vm.expandedGroups}
          toggleGroup={vm.toggleGroup}
        />
        <ReportsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={vm.expandedGroups}
          toggleGroup={vm.toggleGroup}
        />
        <ConfigurationNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={vm.expandedGroups}
          toggleGroup={vm.toggleGroup}
        />
        <ToolsNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          expandedGroups={vm.expandedGroups}
          toggleGroup={vm.toggleGroup}
        />
        <Separator className="my-2" role="separator" />
        <SecondaryNavItems
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </nav>

      <SidebarUserPanel
        user={vm.user}
        userInitials={vm.userInitials}
        onViewProfile={() => setCurrentView('profile' as View)}
        onLogout={vm.logout}
      />
    </aside>
  )
}
