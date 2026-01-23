import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  ChartBar,
  Buildings,
  MapTrifold,
  Question
} from '@phosphor-icons/react'
import { NavItem } from '@/components/nav/NavItem'
import { CoreOperationsNav, ReportsNav, ConfigurationNav, ToolsNav } from '@/components/nav/nav-sections'
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core']))
  
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

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight">WorkForce Pro</h1>
        <p className="text-xs text-muted-foreground mt-1">Back Office Platform</p>
      </div>

      <div className="p-4 border-b border-border">
        <Select value={currentEntity} onValueChange={setCurrentEntity}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Buildings size={16} weight="fill" className="text-primary" />
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

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem
          icon={<ChartBar size={20} />}
          label="Dashboard"
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
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

        <Separator className="my-2" />
        <NavItem
          icon={<Question size={20} />}
          label="Query Guide"
          active={currentView === 'query-guide'}
          onClick={() => setCurrentView('query-guide')}
        />
        <NavItem
          icon={<MapTrifold size={20} />}
          label="Roadmap"
          active={currentView === 'roadmap'}
          onClick={() => setCurrentView('roadmap')}
        />
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@workforce.io</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
