import {
  Clock, Receipt, CurrencyDollar, ShieldCheck, Notepad, ChartLine, ChartBar,
  ClockCounterClockwise, CurrencyCircleDollar, Envelope, Palette, Gear, QrCode,
  UploadSimple, FileText, UserPlus, CalendarBlank, Translate, Shield, FlowArrow, Users
} from '@phosphor-icons/react'
import { NavItem } from './NavItem'
import { NavGroup } from './NavGroup'
import { useTranslation } from '@/hooks/use-translation'
import type { View } from '@/App'
import type { DashboardMetrics } from '@/lib/types'
import type React from 'react'

interface NavItemDef { Icon: React.ElementType; labelKey: string; view: View; badge?: number; permission?: string }

interface NavSectionsProps { currentView: View; setCurrentView: (view: View) => void; metrics: DashboardMetrics; expandedGroups: Set<string>; toggleGroup: (groupId: string) => void }
type NoMetrics = Omit<NavSectionsProps, 'metrics'>

function NavItemsList({ items, currentView, setCurrentView }: { items: NavItemDef[]; currentView: View; setCurrentView: (v: View) => void }) {
  const { t } = useTranslation()
  return (
    <>
      {items.map(({ Icon, labelKey, view, badge, permission }) => (
        <NavItem key={view} icon={<Icon size={20} />} label={t(labelKey)} active={currentView === view} onClick={() => setCurrentView(view)} badge={badge} view={view} permission={permission} />
      ))}
    </>
  )
}

export function CoreOperationsNav({ currentView, setCurrentView, metrics, expandedGroups, toggleGroup }: NavSectionsProps) {
  const { t } = useTranslation()
  const items: NavItemDef[] = [
    { Icon: Clock, labelKey: 'navigation.timesheets', view: 'timesheets', badge: metrics.pendingTimesheets },
    { Icon: Receipt, labelKey: 'navigation.billing', view: 'billing', badge: metrics.overdueInvoices },
    { Icon: CurrencyDollar, labelKey: 'navigation.payroll', view: 'payroll' },
    { Icon: Notepad, labelKey: 'navigation.expenses', view: 'expenses', badge: metrics.pendingExpenses },
    { Icon: ShieldCheck, labelKey: 'navigation.compliance', view: 'compliance', badge: metrics.complianceAlerts },
  ]
  return (
    <NavGroup id="core" label={t('navigation.coreOperations')} expanded={expandedGroups.has('core')} onToggle={() => toggleGroup('core')}>
      <NavItemsList items={items} currentView={currentView} setCurrentView={setCurrentView} />
    </NavGroup>
  )
}

export function ReportsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: NoMetrics) {
  const { t } = useTranslation()
  const items: NavItemDef[] = [
    { Icon: ChartLine, labelKey: 'navigation.reports', view: 'reports' },
    { Icon: ChartBar, labelKey: 'navigation.customReports', view: 'custom-reports' },
    { Icon: Clock, labelKey: 'navigation.scheduledReports', view: 'scheduled-reports' },
    { Icon: ClockCounterClockwise, labelKey: 'navigation.missingTimesheets', view: 'missing-timesheets' },
  ]
  return (
    <NavGroup id="reports" label={t('navigation.reportsAnalytics')} expanded={expandedGroups.has('reports')} onToggle={() => toggleGroup('reports')}>
      <NavItemsList items={items} currentView={currentView} setCurrentView={setCurrentView} />
    </NavGroup>
  )
}

export function ConfigurationNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: NoMetrics) {
  const { t } = useTranslation()
  const items: NavItemDef[] = [
    { Icon: CurrencyCircleDollar, labelKey: 'navigation.currency', view: 'currency', permission: 'settings.edit' },
    { Icon: CurrencyCircleDollar, labelKey: 'navigation.rateTemplates', view: 'rate-templates', permission: 'rates.view' },
    { Icon: Clock, labelKey: 'navigation.shiftPatterns', view: 'shift-patterns', permission: 'settings.edit' },
    { Icon: Envelope, labelKey: 'navigation.emailTemplates', view: 'email-templates', permission: 'settings.edit' },
    { Icon: Palette, labelKey: 'navigation.invoiceTemplates', view: 'invoice-templates', permission: 'settings.edit' },
    { Icon: Gear, labelKey: 'navigation.notificationRules', view: 'notification-rules', permission: 'settings.edit' },
    { Icon: ShieldCheck, labelKey: 'navigation.contractValidation', view: 'contract-validation', permission: 'settings.view' },
    { Icon: Shield, labelKey: 'navigation.rolesPermissions', view: 'roles-permissions', permission: 'users.edit' },
    { Icon: FlowArrow, labelKey: 'navigation.workflowTemplates', view: 'workflow-templates', permission: 'settings.edit' },
    { Icon: Users, labelKey: 'navigation.parallelApprovals', view: 'parallel-approval-demo', permission: 'settings.view' },
  ]
  return (
    <NavGroup id="configuration" label={t('navigation.configuration')} expanded={expandedGroups.has('configuration')} onToggle={() => toggleGroup('configuration')}>
      <NavItemsList items={items} currentView={currentView} setCurrentView={setCurrentView} />
    </NavGroup>
  )
}

export function ToolsNav({ currentView, setCurrentView, expandedGroups, toggleGroup }: NoMetrics) {
  const { t } = useTranslation()
  const items: NavItemDef[] = [
    { Icon: QrCode, labelKey: 'navigation.qrScanner', view: 'qr-scanner' },
    { Icon: UploadSimple, labelKey: 'navigation.batchImport', view: 'batch-import', permission: 'timesheets.create' },
    { Icon: FileText, labelKey: 'navigation.purchaseOrders', view: 'purchase-orders', permission: 'invoices.view' },
    { Icon: UserPlus, labelKey: 'navigation.onboarding', view: 'onboarding', permission: 'workers.create' },
    { Icon: CalendarBlank, labelKey: 'navigation.holidayPay', view: 'holiday-pay', permission: 'payroll.view' },
    { Icon: ClockCounterClockwise, labelKey: 'navigation.auditTrail', view: 'audit-trail', permission: 'reports.audit' },
    { Icon: Translate, labelKey: 'navigation.translations', view: 'translation-demo' },
  ]
  return (
    <NavGroup id="tools" label={t('navigation.toolsUtilities')} expanded={expandedGroups.has('tools')} onToggle={() => toggleGroup('tools')}>
      <NavItemsList items={items} currentView={currentView} setCurrentView={setCurrentView} />
    </NavGroup>
  )
}
