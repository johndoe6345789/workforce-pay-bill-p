import type { View } from '@/App'

const viewPreloadMap: Record<View, () => Promise<any>> = {
  'dashboard': () => import('@/components/views'),
  'timesheets': () => import('@/components/views'),
  'billing': () => import('@/components/views'),
  'payroll': () => import('@/components/views'),
  'compliance': () => import('@/components/views'),
  'expenses': () => import('@/components/views'),
  'reports': () => import('@/components/ReportsView'),
  'currency': () => import('@/components/CurrencyManagement'),
  'email-templates': () => import('@/components/EmailTemplateManager'),
  'invoice-templates': () => import('@/components/InvoiceTemplateManager'),
  'qr-scanner': () => import('@/components/QRTimesheetScanner'),
  'missing-timesheets': () => import('@/components/MissingTimesheetsReport'),
  'purchase-orders': () => import('@/components/PurchaseOrderManager'),
  'onboarding': () => import('@/components/OnboardingWorkflowManager'),
  'audit-trail': () => import('@/components/AuditTrailViewer'),
  'notification-rules': () => import('@/components/NotificationRulesManager'),
  'batch-import': () => import('@/components/BatchImportManager'),
  'rate-templates': () => import('@/components/RateTemplateManager'),
  'custom-reports': () => import('@/components/CustomReportBuilder'),
  'holiday-pay': () => import('@/components/HolidayPayManager'),
  'contract-validation': () => import('@/components/ContractValidator'),
  'shift-patterns': () => import('@/components/ShiftPatternManager'),
  'query-guide': () => import('@/components/QueryLanguageGuide'),
  'roadmap': () => import('@/components/roadmap-view'),
  'component-showcase': () => import('@/components/ComponentShowcase'),
  'business-logic-demo': () => import('@/components/BusinessLogicDemo'),
  'data-admin': () => import('@/components/views/data-admin-view'),
  'translation-demo': () => import('@/components/TranslationDemo'),
  'profile': () => import('@/components/views/profile-view'),
}

const preloadedViews = new Set<View>()

export function preloadView(view: View) {
  if (preloadedViews.has(view)) {
    return
  }

  const preloadFn = viewPreloadMap[view]
  if (preloadFn) {
    preloadFn()
      .then(() => {
        preloadedViews.add(view)
      })
      .catch(() => {})
  }
}

export function preloadCommonViews() {
  const commonViews: View[] = ['timesheets', 'billing', 'reports', 'missing-timesheets']
  commonViews.forEach(view => preloadView(view))
}
