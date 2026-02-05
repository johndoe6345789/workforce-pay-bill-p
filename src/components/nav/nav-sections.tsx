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
import { useTranslation } from '@/hooks/use-translation'
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
  const { t } = useTranslation()
  
  return (
    <NavGroup
      id="core"
      label={t('navigation.coreOperations')}
      expanded={expandedGroups.has('core')}
      onToggle={() => toggleGroup('core')}
    >
      <NavItem
        icon={<Clock size={20} />}
        label={t('navigation.timesheets')}
        active={currentView === 'timesheets'}
        onClick={() => setCurrentView('timesheets')}
        badge={metrics.pendingTimesheets}
        view="timesheets"
      />
      <NavItem
        icon={<Receipt size={20} />}
        label={t('navigation.billing')}
        active={currentView === 'billing'}
        onClick={() => setCurrentView('billing')}
        badge={metrics.overdueInvoices}
        view="billing"
      />
      <NavItem
        icon={<CurrencyDollar size={20} />}
        label={t('navigation.payroll')}
        active={currentView === 'payroll'}
        onClick={() => setCurrentView('payroll')}
        view="payroll"
      />
      <NavItem
        icon={<Notepad size={20} />}
        label={t('navigation.expenses')}
        active={currentView === 'expenses'}
        onClick={() => setCurrentView('expenses')}
        badge={metrics.pendingExpenses}
        view="expenses"
      />
      <NavItem
        icon={<ShieldCheck size={20} />}
        label={t('navigation.compliance')}
        active={currentView === 'compliance'}
        onClick={() => setCurrentView('compliance')}
        badge={metrics.complianceAlerts}
        view="compliance"
      />
    </NavGroup>
  )
}

export function ReportsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  const { t } = useTranslation()
  
  return (
    <NavGroup
      id="reports"
      label={t('navigation.reportsAnalytics')}
      expanded={expandedGroups.has('reports')}
      onToggle={() => toggleGroup('reports')}
    >
      <NavItem
        icon={<ChartLine size={20} />}
        label={t('navigation.reports')}
        active={currentView === 'reports'}
        onClick={() => setCurrentView('reports')}
        view="reports"
      />
      <NavItem
        icon={<ChartBar size={20} />}
        label={t('navigation.customReports')}
        active={currentView === 'custom-reports'}
        onClick={() => setCurrentView('custom-reports')}
        view="custom-reports"
      />
      <NavItem
        icon={<Clock size={20} />}
        label={t('navigation.scheduledReports')}
        active={currentView === 'scheduled-reports'}
        onClick={() => setCurrentView('scheduled-reports')}
        view="scheduled-reports"
      />
      <NavItem
        icon={<ClockCounterClockwise size={20} />}
        label={t('navigation.missingTimesheets')}
        active={currentView === 'missing-timesheets'}
        onClick={() => setCurrentView('missing-timesheets')}
        view="missing-timesheets"
      />
    </NavGroup>
  )
}

export function ConfigurationNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  const { t } = useTranslation()
  
  return (
    <NavGroup
      id="configuration"
      label={t('navigation.configuration')}
      expanded={expandedGroups.has('configuration')}
      onToggle={() => toggleGroup('configuration')}
    >
      <NavItem
        icon={<CurrencyCircleDollar size={20} />}
        label={t('navigation.currency')}
        active={currentView === 'currency'}
        onClick={() => setCurrentView('currency')}
        view="currency"
        permission="settings.edit"
      />
      <NavItem
        icon={<CurrencyCircleDollar size={20} />}
        label={t('navigation.rateTemplates')}
        active={currentView === 'rate-templates'}
        onClick={() => setCurrentView('rate-templates')}
        view="rate-templates"
        permission="rates.view"
      />
      <NavItem
        icon={<Clock size={20} />}
        label={t('navigation.shiftPatterns')}
        active={currentView === 'shift-patterns'}
        onClick={() => setCurrentView('shift-patterns')}
        view="shift-patterns"
        permission="settings.edit"
      />
      <NavItem
        icon={<Envelope size={20} />}
        label={t('navigation.emailTemplates')}
        active={currentView === 'email-templates'}
        onClick={() => setCurrentView('email-templates')}
        view="email-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Palette size={20} />}
        label={t('navigation.invoiceTemplates')}
        active={currentView === 'invoice-templates'}
        onClick={() => setCurrentView('invoice-templates')}
        view="invoice-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Gear size={20} />}
        label={t('navigation.notificationRules')}
        active={currentView === 'notification-rules'}
        onClick={() => setCurrentView('notification-rules')}
        view="notification-rules"
        permission="settings.edit"
      />
      <NavItem
        icon={<ShieldCheck size={20} />}
        label={t('navigation.contractValidation')}
        active={currentView === 'contract-validation'}
        onClick={() => setCurrentView('contract-validation')}
        view="contract-validation"
        permission="settings.view"
      />
      <NavItem
        icon={<Shield size={20} />}
        label={t('navigation.rolesPermissions')}
        active={currentView === 'roles-permissions'}
        onClick={() => setCurrentView('roles-permissions')}
        view="roles-permissions"
        permission="users.edit"
      />
      <NavItem
        icon={<FlowArrow size={20} />}
        label={t('navigation.workflowTemplates')}
        active={currentView === 'workflow-templates'}
        onClick={() => setCurrentView('workflow-templates')}
        view="workflow-templates"
        permission="settings.edit"
      />
      <NavItem
        icon={<Users size={20} />}
        label={t('navigation.parallelApprovals')}
        active={currentView === 'parallel-approval-demo'}
        onClick={() => setCurrentView('parallel-approval-demo')}
        view="parallel-approval-demo"
        permission="settings.view"
      />
    </NavGroup>
  )
}

export function ToolsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: Omit<NavSectionsProps, 'metrics'>) {
  const { t } = useTranslation()
  
  return (
    <NavGroup
      id="tools"
      label={t('navigation.toolsUtilities')}
      expanded={expandedGroups.has('tools')}
      onToggle={() => toggleGroup('tools')}
    >
      <NavItem
        icon={<QrCode size={20} />}
        label={t('navigation.qrScanner')}
        active={currentView === 'qr-scanner'}
        onClick={() => setCurrentView('qr-scanner')}
        view="qr-scanner"
      />
      <NavItem
        icon={<UploadSimple size={20} />}
        label={t('navigation.batchImport')}
        active={currentView === 'batch-import'}
        onClick={() => setCurrentView('batch-import')}
        view="batch-import"
        permission="timesheets.create"
      />
      <NavItem
        icon={<FileText size={20} />}
        label={t('navigation.purchaseOrders')}
        active={currentView === 'purchase-orders'}
        onClick={() => setCurrentView('purchase-orders')}
        view="purchase-orders"
        permission="invoices.view"
      />
      <NavItem
        icon={<UserPlus size={20} />}
        label={t('navigation.onboarding')}
        active={currentView === 'onboarding'}
        onClick={() => setCurrentView('onboarding')}
        view="onboarding"
        permission="workers.create"
      />
      <NavItem
        icon={<CalendarBlank size={20} />}
        label={t('navigation.holidayPay')}
        active={currentView === 'holiday-pay'}
        onClick={() => setCurrentView('holiday-pay')}
        view="holiday-pay"
        permission="payroll.view"
      />
      <NavItem
        icon={<ClockCounterClockwise size={20} />}
        label={t('navigation.auditTrail')}
        active={currentView === 'audit-trail'}
        onClick={() => setCurrentView('audit-trail')}
        view="audit-trail"
        permission="reports.audit"
      />
      <NavItem
        icon={<Translate size={20} />}
        label={t('navigation.translations')}
        active={currentView === 'translation-demo'}
        onClick={() => setCurrentView('translation-demo')}
        view="translation-demo"
      />
    </NavGroup>
  )
}
