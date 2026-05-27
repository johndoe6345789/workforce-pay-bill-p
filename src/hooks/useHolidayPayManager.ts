import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'

export interface HolidayAccrual {
  id: string
  workerId: string
  workerName: string
  accruedDays: number
  takenDays: number
  remainingDays: number
  lastUpdated: string
}

export interface HolidayRequest {
  id: string
  workerId: string
  workerName: string
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  approvedDate?: string
}

export const STANDARD_ACCRUAL_RATE = 5.6

const DEFAULT_FORM = { workerId: '', workerName: '', startDate: '', endDate: '', days: 0 }
export type HolidayFormData = typeof DEFAULT_FORM

export function calculateDaysBetweenDates(start: string, end: string): number {
  if (!start || !end) return 0
  const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export function useHolidayPayManager() {
  const { t } = useTranslation()
  const [accruals = [], setAccruals] = useKV<HolidayAccrual[]>('holiday-accruals', [])
  const [requests = [], setRequests] = useKV<HolidayRequest[]>('holiday-requests', [])
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [formData, setFormData] = useState<HolidayFormData>(DEFAULT_FORM)

  const handleRequestHoliday = () => {
    if (!formData.workerName || !formData.startDate || !formData.endDate || formData.days <= 0) {
      toast.error(t('holidayPay.fillAllFields'))
      return
    }
    const newRequest: HolidayRequest = {
      id: `HR-${Date.now()}`,
      workerId: formData.workerId || `W-${Date.now()}`,
      workerName: formData.workerName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: formData.days,
      status: 'pending',
      requestedDate: new Date().toISOString()
    }
    setRequests(current => [...(current || []), newRequest])
    toast.success(t('holidayPay.requestCreated'))
    setFormData(DEFAULT_FORM)
    setIsRequestDialogOpen(false)
  }

  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return
    const accrual = accruals.find(a => a.workerId === request.workerId)
    if (!accrual || accrual.remainingDays < request.days) {
      toast.error(t('holidayPay.insufficientBalance'))
      return
    }
    setRequests(current => (current || []).map(r => r.id === requestId ? { ...r, status: 'approved' as const, approvedDate: new Date().toISOString() } : r))
    setAccruals(current => (current || []).map(a => a.workerId === request.workerId
      ? { ...a, takenDays: a.takenDays + request.days, remainingDays: a.remainingDays - request.days, lastUpdated: new Date().toISOString() }
      : a
    ))
    toast.success(t('holidayPay.requestApproved'))
  }

  const handleRejectRequest = (requestId: string) => {
    setRequests(current => (current || []).map(r => r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    toast.error(t('holidayPay.requestRejected'))
  }

  const totalAccrued = accruals.reduce((sum, a) => sum + a.accruedDays, 0)
  const totalTaken = accruals.reduce((sum, a) => sum + a.takenDays, 0)
  const pendingCount = requests.filter(r => r.status === 'pending').length

  return {
    t, accruals, requests,
    isRequestDialogOpen, setIsRequestDialogOpen,
    formData, setFormData,
    totalAccrued, totalTaken, pendingCount,
    handleRequestHoliday, handleApproveRequest, handleRejectRequest,
  }
}
