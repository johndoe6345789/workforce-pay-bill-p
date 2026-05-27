import { Download, ArrowClockwise } from '@phosphor-icons/react'
import type React from 'react'

export const STORAGE_ENTITIES: { labelKey: string; kvKey: string }[] = [
  { labelKey: 'navigation.timesheets',      kvKey: 'timesheets' },
  { labelKey: 'navigation.billing',         kvKey: 'invoices' },
  { labelKey: 'navigation.payroll',         kvKey: 'payroll-runs' },
  { labelKey: 'auditTrail.entities.workers', kvKey: 'workers' },
  { labelKey: 'navigation.compliance',      kvKey: 'compliance-docs' },
  { labelKey: 'navigation.expenses',        kvKey: 'expenses' },
  { labelKey: 'navigation.rateTemplates',   kvKey: 'rate-cards' },
  { labelKey: 'billing.client',             kvKey: 'clients' },
]

export const ACTION_CARDS: {
  Icon: React.ElementType; titleKey: string; descKey: string
  infoKey: string; btnKey: string; variant?: 'destructive'; action: 'export' | 'reset'
}[] = [
  { Icon: Download,       titleKey: 'dataAdmin.exportCurrentData', descKey: 'dataAdmin.exportCurrentDataDescription', infoKey: 'dataAdmin.exportDataInfo', btnKey: 'dataAdmin.exportData', action: 'export' },
  { Icon: ArrowClockwise, titleKey: 'dataAdmin.resetToDefault',    descKey: 'dataAdmin.resetToDefaultDescription',    infoKey: 'dataAdmin.resetDataInfo',   btnKey: 'dataAdmin.resetData',   variant: 'destructive', action: 'reset' },
]

export const DATA_FLOW_STEPS: { titleKey: string; descKey: string }[] = [
  { titleKey: 'dataAdmin.loadFromJson',    descKey: 'dataAdmin.loadFromJsonDescription' },
  { titleKey: 'dataAdmin.storeInKv',      descKey: 'dataAdmin.storeInKvDescription' },
  { titleKey: 'dataAdmin.useInApp',       descKey: 'dataAdmin.useInAppDescription' },
  { titleKey: 'dataAdmin.persistChanges', descKey: 'dataAdmin.persistChangesDescription' },
]
