import { useCallback } from 'react'
import type { ComplianceDocument, Worker, ComplianceStatus } from '@/lib/types'
import type { ComplianceRule, ComplianceCheck } from './use-compliance-tracking.types'

export function useComplianceCheckers(
  workers: Worker[],
  complianceDocs: ComplianceDocument[],
  complianceRules: ComplianceRule[],
) {
  const calculateDaysUntilExpiry = useCallback((expiryDate: string): number => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    return Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }, [])

  const determineDocumentStatus = useCallback((expiryDate: string): ComplianceStatus => {
    const days = calculateDaysUntilExpiry(expiryDate)
    if (days < 0) return 'expired'
    if (days < 30) return 'expiring'
    return 'valid'
  }, [calculateDaysUntilExpiry])

  const checkWorkerCompliance = useCallback((workerId: string): ComplianceCheck => {
    const worker = workers.find(w => w.id === workerId)
    const workerDocs = complianceDocs.filter(doc => doc.workerId === workerId)
    const requiredRules = complianceRules.filter(rule => {
      if (!rule.required) return false
      if (!rule.applicableWorkerTypes) return true
      return worker && rule.applicableWorkerTypes.includes(worker.type)
    })
    const missingDocuments: string[] = []
    const expiringDocuments: ComplianceDocument[] = []
    const expiredDocuments: ComplianceDocument[] = []
    requiredRules.forEach(rule => {
      const doc = workerDocs.find(d => d.documentType === rule.documentType)
      if (!doc) {
        missingDocuments.push(rule.documentType)
      } else {
        if (doc.status === 'expired') expiredDocuments.push(doc)
        else if (doc.status === 'expiring') expiringDocuments.push(doc)
      }
    })
    const totalChecks = requiredRules.length
    const passedChecks = totalChecks - missingDocuments.length - expiredDocuments.length
    return {
      workerId,
      workerName: worker?.name || 'Unknown',
      isCompliant: missingDocuments.length === 0 && expiredDocuments.length === 0,
      missingDocuments, expiringDocuments, expiredDocuments,
      complianceScore: totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0,
    }
  }, [workers, complianceDocs, complianceRules])

  const canWorkerBeAssigned = useCallback((workerId: string): boolean => {
    return checkWorkerCompliance(workerId).isCompliant
  }, [checkWorkerCompliance])

  return { calculateDaysUntilExpiry, determineDocumentStatus, checkWorkerCompliance, canWorkerBeAssigned }
}
