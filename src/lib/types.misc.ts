import type { NotificationType } from './types.finance'
import type { LinkedInvoice } from './types.invoice'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: NotificationType
  variables: string[]
}

export interface QRTimesheetData {
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  hours: number
  rate: number
  signature?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  entityType: 'timesheet' | 'invoice' | 'payroll' | 'worker' | 'expense' | 'rate-card'
  entityId: string
  changes: Record<string, { from: unknown; to: unknown }>
  ipAddress?: string
}

export type PurchaseOrderStatus = 'active' | 'expired' | 'fulfilled' | 'cancelled' | 'expiring-soon'

export interface PurchaseOrder {
  id: string
  poNumber: string
  clientId: string
  clientName: string
  issueDate: string
  expiryDate?: string
  totalValue: number
  remainingValue: number
  utilisedValue: number
  status: PurchaseOrderStatus
  currency: string
  linkedInvoices: LinkedInvoice[]
  notes?: string
  approvedBy?: string
  approvedDate?: string
  createdBy: string
  createdDate: string
  lastModifiedDate: string
  attachmentUrls?: string[]
  tags?: string[]
}
