import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { ComplianceDocument, Worker } from '@/lib/types'
import { DEFAULT_COMPLIANCE_RULES } from './use-compliance-tracking.types'
import type { ComplianceRule } from './use-compliance-tracking.types'
import { useComplianceCheckers } from './use-compliance-checkers'
import { useComplianceDocsCrud } from './use-compliance-docs-crud'

export type { ComplianceRule, ComplianceCheck, ComplianceDashboard, DocumentRenewalAlert } from './use-compliance-tracking.types'

export function useComplianceTracking(customRules?: ComplianceRule[]) {
  const [complianceDocs = [], setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])
  const [workers = []] = useKV<Worker[]>('workers', [])
  const [complianceRules] = useState<ComplianceRule[]>(customRules || DEFAULT_COMPLIANCE_RULES)

  const { calculateDaysUntilExpiry, determineDocumentStatus, checkWorkerCompliance, canWorkerBeAssigned } =
    useComplianceCheckers(workers, complianceDocs, complianceRules)

  const { addComplianceDocument, updateDocumentExpiry } =
    useComplianceDocsCrud(setComplianceDocs, calculateDaysUntilExpiry, determineDocumentStatus)

  const getComplianceDashboard = useCallback(() => {
    const activeWorkers = workers.filter(w => w.status === 'active')
    const complianceChecks = activeWorkers.map(w => checkWorkerCompliance(w.id))
    const compliantWorkers = complianceChecks.filter(c => c.isCompliant).length
    const documentsByType = complianceDocs.reduce((acc, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return {
      totalWorkers: activeWorkers.length,
      compliantWorkers,
      nonCompliantWorkers: activeWorkers.length - compliantWorkers,
      complianceRate: activeWorkers.length > 0 ? (compliantWorkers / activeWorkers.length) * 100 : 0,
      documentsExpiringSoon: complianceDocs.filter(d => d.status === 'expiring').length,
      documentsExpired: complianceDocs.filter(d => d.status === 'expired').length,
      documentsByType,
    }
  }, [workers, complianceDocs, checkWorkerCompliance])

  const getRenewalAlerts = useCallback((daysAhead: number = 90) => {
    const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
    return complianceDocs
      .filter(doc => new Date(doc.expiryDate) <= futureDate)
      .map(doc => {
        const daysUntilExpiry = calculateDaysUntilExpiry(doc.expiryDate)
        const urgency: 'critical' | 'high' | 'medium' | 'low' =
          daysUntilExpiry < 0 ? 'critical' : daysUntilExpiry < 14 ? 'high' : daysUntilExpiry < 30 ? 'medium' : 'low'
        return { documentId: doc.id, workerId: doc.workerId, workerName: doc.workerName, documentType: doc.documentType, expiryDate: doc.expiryDate, daysUntilExpiry, urgency }
      })
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }, [complianceDocs, calculateDaysUntilExpiry])

  const getNonCompliantWorkers = useCallback(() => {
    return workers.filter(w => w.status === 'active')
      .map(w => checkWorkerCompliance(w.id))
      .filter(check => !check.isCompliant)
      .sort((a, b) => a.complianceScore - b.complianceScore)
  }, [workers, checkWorkerCompliance])

  return {
    complianceDocs, complianceRules,
    checkWorkerCompliance, addComplianceDocument, updateDocumentExpiry,
    getComplianceDashboard, getRenewalAlerts, getNonCompliantWorkers,
    canWorkerBeAssigned, determineDocumentStatus,
  }
}
