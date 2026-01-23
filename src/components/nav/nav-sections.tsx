import {
  Clock,
  Receipt,
  CurrencyDollar,
  ShieldCheck,
  Notepad,
  ChartLine,
  ChartBar,
  ClockCounterClockwise,
  CurrencyCircleDollar,
  Envelope,
  Palette,
  Gear,
  QrCode,
  UploadSimple,
  FileText,
  UserPlus,
  CalendarBlank
} from '@phosphor-icons/react'
import { NavItem } from './NavItem'
import { NavGroup } from './NavGroup'
import type { View } from '@/App'
import type { DashboardMetrics } from '@/lib/types'

interface NavSectionsProps {
  currentView: View
  setCurrentView: (view: View) => void
  metrics: DashboardMetrics
  expandedGroups: Set<string>
  toggleGroup: (groupId: string) => void
}

export function CoreOperationsNav({ currentView, setCurrentView, metrics, expandedGroups, toggleGroup }: NavSectionsProps) {
  return (
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
  )
}

export function ReportsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  return (
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
  )
}

export function ConfigurationNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  return (
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
  )
}

export function ToolsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  return (
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
  )
}
