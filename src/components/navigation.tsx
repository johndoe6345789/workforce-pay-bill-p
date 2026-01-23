import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  CaretDown,
  CaretRight,
  ChartBar,
  Buildings,
  MapTrifold,
  Clock,
  Receipt,
  CurrencyDollar,
  ShieldCheck,
  Notepad,
  ChartLine,
  ClockCounterClockwise,
  CurrencyCircleDollar,
  Envelope,
  Palette,
  Gear,
  QrCode,
  UploadSimple,
  FileText,
  UserPlus,
  CalendarBlank,
  Question
} from '@phosphor-icons/react'
import type { View } from '@/App'
import type { DashboardMetrics } from '@/lib/types'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  badge?: number
}

export function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active 
          ? 'bg-accent text-accent-foreground' 
          : 'text-foreground hover:bg-muted'
      )}
    >
      <span className={active ? 'text-accent-foreground' : 'text-muted-foreground'}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </button>
  )
}

interface NavGroupProps {
  id: string
  label: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function NavGroup({ label, expanded, onToggle, children }: NavGroupProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {expanded ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
        <span className="flex-1 text-left">{label}</span>
      </button>
      {expanded && (
        <div className="space-y-1 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}

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
        
        <NavGroup
          id="core"
          label="Core Operations"
          expanded={expandedGroups.has('core')}
          onToggle={() => toggleGroup('core')}
        >
          <NavItem
            icon={<Clock size={20} />}
            label="Timesheets"
            active={currentView === 'timesheets'}
            onClick={() => setCurrentView('timesheets')}
            badge={metrics.pendingTimesheets}
          />
          <NavItem
            icon={<Receipt size={20} />}
            label="Billing"
            active={currentView === 'billing'}
            onClick={() => setCurrentView('billing')}
            badge={metrics.overdueInvoices}
          />
          <NavItem
            icon={<CurrencyDollar size={20} />}
            label="Payroll"
            active={currentView === 'payroll'}
            onClick={() => setCurrentView('payroll')}
          />
          <NavItem
            icon={<Notepad size={20} />}
            label="Expenses"
            active={currentView === 'expenses'}
            onClick={() => setCurrentView('expenses')}
            badge={metrics.pendingExpenses}
          />
          <NavItem
            icon={<ShieldCheck size={20} />}
            label="Compliance"
            active={currentView === 'compliance'}
            onClick={() => setCurrentView('compliance')}
            badge={metrics.complianceAlerts}
          />
        </NavGroup>

        <NavGroup
          id="reports"
          label="Reports & Analytics"
          expanded={expandedGroups.has('reports')}
          onToggle={() => toggleGroup('reports')}
        >
          <NavItem
            icon={<ChartLine size={20} />}
            label="Reports"
            active={currentView === 'reports'}
            onClick={() => setCurrentView('reports')}
          />
          <NavItem
            icon={<ChartBar size={20} />}
            label="Custom Reports"
            active={currentView === 'custom-reports'}
            onClick={() => setCurrentView('custom-reports')}
          />
          <NavItem
            icon={<ClockCounterClockwise size={20} />}
            label="Missing Timesheets"
            active={currentView === 'missing-timesheets'}
            onClick={() => setCurrentView('missing-timesheets')}
          />
        </NavGroup>

        <NavGroup
          id="configuration"
          label="Configuration"
          expanded={expandedGroups.has('configuration')}
          onToggle={() => toggleGroup('configuration')}
        >
          <NavItem
            icon={<CurrencyCircleDollar size={20} />}
            label="Currency"
            active={currentView === 'currency'}
            onClick={() => setCurrentView('currency')}
          />
          <NavItem
            icon={<CurrencyCircleDollar size={20} />}
            label="Rate Templates"
            active={currentView === 'rate-templates'}
            onClick={() => setCurrentView('rate-templates')}
          />
          <NavItem
            icon={<Clock size={20} />}
            label="Shift Patterns"
            active={currentView === 'shift-patterns'}
            onClick={() => setCurrentView('shift-patterns')}
          />
          <NavItem
            icon={<Envelope size={20} />}
            label="Email Templates"
            active={currentView === 'email-templates'}
            onClick={() => setCurrentView('email-templates')}
          />
          <NavItem
            icon={<Palette size={20} />}
            label="Invoice Templates"
            active={currentView === 'invoice-templates'}
            onClick={() => setCurrentView('invoice-templates')}
          />
          <NavItem
            icon={<Gear size={20} />}
            label="Notification Rules"
            active={currentView === 'notification-rules'}
            onClick={() => setCurrentView('notification-rules')}
          />
          <NavItem
            icon={<ShieldCheck size={20} />}
            label="Contract Validation"
            active={currentView === 'contract-validation'}
            onClick={() => setCurrentView('contract-validation')}
          />
        </NavGroup>

        <NavGroup
          id="tools"
          label="Tools & Utilities"
          expanded={expandedGroups.has('tools')}
          onToggle={() => toggleGroup('tools')}
        >
          <NavItem
            icon={<QrCode size={20} />}
            label="QR Scanner"
            active={currentView === 'qr-scanner'}
            onClick={() => setCurrentView('qr-scanner')}
          />
          <NavItem
            icon={<UploadSimple size={20} />}
            label="Batch Import"
            active={currentView === 'batch-import'}
            onClick={() => setCurrentView('batch-import')}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Purchase Orders"
            active={currentView === 'purchase-orders'}
            onClick={() => setCurrentView('purchase-orders')}
          />
          <NavItem
            icon={<UserPlus size={20} />}
            label="Onboarding"
            active={currentView === 'onboarding'}
            onClick={() => setCurrentView('onboarding')}
          />
          <NavItem
            icon={<CalendarBlank size={20} />}
            label="Holiday Pay"
            active={currentView === 'holiday-pay'}
            onClick={() => setCurrentView('holiday-pay')}
          />
          <NavItem
            icon={<ClockCounterClockwise size={20} />}
            label="Audit Trail"
            active={currentView === 'audit-trail'}
            onClick={() => setCurrentView('audit-trail')}
          />
        </NavGroup>

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
