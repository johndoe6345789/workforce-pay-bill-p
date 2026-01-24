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
  CalendarBlank,
  Translate,
  Shield,
  FlowArrow,
  Users
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
        view="timesheets"
      />
      <NavItem
        icon={<Receipt size={20} />}
        label="Billing"
        active={currentView === 'billing'}
        onClick={() => setCurrentView('billing')}
        badge={metrics.overdueInvoices}
        view="billing"
      />
      <NavItem
        icon={<CurrencyDollar size={20} />}
        label="Payroll"
        active={currentView === 'payroll'}
        onClick={() => setCurrentView('payroll')}
        view="payroll"
      />
      <NavItem
        icon={<Notepad size={20} />}
        label="Expenses"
        active={currentView === 'expenses'}
        onClick={() => setCurrentView('expenses')}
        badge={metrics.pendingExpenses}
        view="expenses"
      />
      <NavItem
        icon={<ShieldCheck size={20} />}
        label="Compliance"
        active={currentView === 'compliance'}
        onClick={() => setCurrentView('compliance')}
        badge={metrics.complianceAlerts}
        view="compliance"
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
        view="reports"
      />
      <NavItem
        icon={<ChartBar size={20} />}
        label="Custom Reports"
        active={currentView === 'custom-reports'}
        onClick={() => setCurrentView('custom-reports')}
        view="custom-reports"
      />
      <NavItem
        icon={<ClockCounterClockwise size={20} />}
        label="Missing Timesheets"
        active={currentView === 'missing-timesheets'}
        onClick={() => setCurrentView('missing-timesheets')}
        view="missing-timesheets"
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
        view="currency"
        permission="settings.edit"
      />
      <NavItem
        icon={<CurrencyCircleDollar size={20} />}
        label="Rate Templates"
        active={currentView === 'rate-templates'}
        onClick={() => setCurrentView('rate-templates')}
        view="rate-templates"
        permission="rates.view"
      />
      <NavItem
        icon={<Clock size={20} />}
        label="Shift Patterns"
        active={currentView === 'shift-patterns'}
        onClick={() => setCurrentView('shift-patterns')}
        view="shift-patterns"
        permission="settings.edit"
      />
      <NavItem
        icon={<Envelope size={20} />}
        label="Email Templates"
        active={currentView === 'email-templates'}
        onClick={() => setCurrentView('email-templates')}
        view="email-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Palette size={20} />}
        label="Invoice Templates"
        active={currentView === 'invoice-templates'}
        onClick={() => setCurrentView('invoice-templates')}
        view="invoice-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Gear size={20} />}
        label="Notification Rules"
        active={currentView === 'notification-rules'}
        onClick={() => setCurrentView('notification-rules')}
        view="notification-rules"
        permission="settings.edit"
      />
      <NavItem
        icon={<ShieldCheck size={20} />}
        label="Contract Validation"
        active={currentView === 'contract-validation'}
        onClick={() => setCurrentView('contract-validation')}
        view="contract-validation"
        permission="settings.view"
      />
      <NavItem
        icon={<Shield size={20} />}
        label="Roles & Permissions"
        active={currentView === 'roles-permissions'}
        onClick={() => setCurrentView('roles-permissions')}
        view="roles-permissions"
        permission="users.edit"
      />
      <NavItem
        icon={<FlowArrow size={20} />}
        label="Workflow Templates"
        active={currentView === 'workflow-templates'}
        onClick={() => setCurrentView('workflow-templates')}
        view="workflow-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Users size={20} />}
        label="Parallel Approvals"
        active={currentView === 'parallel-approval-demo'}
        onClick={() => setCurrentView('parallel-approval-demo')}
        view="parallel-approval-demo"
        permission="settings.view"
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
        view="qr-scanner"
      />
      <NavItem
        icon={<UploadSimple size={20} />}
        label="Batch Import"
        active={currentView === 'batch-import'}
        onClick={() => setCurrentView('batch-import')}
        view="batch-import"
        permission="timesheets.create"
      />
      <NavItem
        icon={<FileText size={20} />}
        label="Purchase Orders"
        active={currentView === 'purchase-orders'}
        onClick={() => setCurrentView('purchase-orders')}
        view="purchase-orders"
        permission="invoices.view"
      />
      <NavItem
        icon={<UserPlus size={20} />}
        label="Onboarding"
        active={currentView === 'onboarding'}
        onClick={() => setCurrentView('onboarding')}
        view="onboarding"
        permission="workers.create"
      />
      <NavItem
        icon={<CalendarBlank size={20} />}
        label="Holiday Pay"
        active={currentView === 'holiday-pay'}
        onClick={() => setCurrentView('holiday-pay')}
        view="holiday-pay"
        permission="payroll.view"
      />
      <NavItem
        icon={<ClockCounterClockwise size={20} />}
        label="Audit Trail"
        active={currentView === 'audit-trail'}
        onClick={() => setCurrentView('audit-trail')}
        view="audit-trail"
        permission="reports.audit"
      />
      <NavItem
        icon={<Translate size={20} />}
        label="Translations"
        active={currentView === 'translation-demo'}
        onClick={() => setCurrentView('translation-demo')}
        view="translation-demo"
      />
    </NavGroup>
  )
}
