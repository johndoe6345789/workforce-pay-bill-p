import type { PurchaseOrder } from '@/lib/types'

export const EMPTY_FORM = {
  poNumber: '', clientName: '', clientId: '', expiryDate: '',
  totalValue: '', currency: 'GBP', notes: '', approvedBy: ''
} as const

export type POFormData = {
  poNumber: string
  clientName: string
  clientId: string
  expiryDate: string
  totalValue: string
  currency: string
  notes: string
  approvedBy: string
}

export type POMetrics = {
  activeCount: number
  totalValue: number
  remainingValue: number
  utilisedValue: number
  expiredCount: number
  expiringSoonCount: number
  averageUtilization: number
}

export type StatusColor = string

export type GetStatusColor = (status: PurchaseOrder['status']) => StatusColor
