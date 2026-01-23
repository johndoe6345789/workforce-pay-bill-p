import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { ComplianceDocument, Worker, ComplianceStatus } from '@/lib/types'

interface ComplianceRule {
  documentType: string
  required: boolean
  expiryWarningDays: number
  renewalLeadDays: number
  applicableWorkerTypes?: string[]
}

interface ComplianceCheck {
  workerId: string
  workerName: string
  isCompliant: boolean
  missingDocuments: string[]
  expiringDocuments: ComplianceDocument[]
  expiredDocuments: ComplianceDocument[]
  complianceScore: number
}

interface ComplianceDashboard {
  totalWorkers: number
  compliantWorkers: number
  nonCompliantWorkers: number
  complianceRate: number
  documentsExpiringSoon: number
  documentsExpired: number
  documentsByType: Record<string, number>
}

interface DocumentRenewalAlert {
  documentId: string
  workerId: string
  workerName: string
  documentType: string
  expiryDate: string
  daysUntilExpiry: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
}

const DEFAULT_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    documentType: 'Right to Work',
    required: true,
    expiryWarningDays: 30,
    renewalLeadDays: 60
  },
  {
    documentType: 'DBS Check',
    required: true,
    expiryWarningDays: 45,
    renewalLeadDays: 90
  },
  {
    documentType: 'Professional Qualification',
    required: true,
    expiryWarningDays: 60,
    renewalLeadDays: 90
  },
  {
    documentType: 'Health & Safety Training',
    required: true,
    expiryWarningDays: 30,
    renewalLeadDays: 60
  },
  {
    documentType: 'First Aid Certificate',
    required: false,
    expiryWarningDays: 30,
    renewalLeadDays: 60
  },
  {
    documentType: 'Driving License',
    required: false,
    expiryWarningDays: 60,
    renewalLeadDays: 90
  }
]

export function useComplianceTracking(customRules?: ComplianceRule[]) {
  const [complianceDocs = [], setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])
  const [workers = []] = useKV<Worker[]>('workers', [])
  const [complianceRules] = useState<ComplianceRule[]>(customRules || DEFAULT_COMPLIANCE_RULES)

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
        if (doc.status === 'expired') {
          expiredDocuments.push(doc)
        } else if (doc.status === 'expiring') {
          expiringDocuments.push(doc)
        }
      }
    })

    const totalChecks = requiredRules.length
    const passedChecks = totalChecks - missingDocuments.length - expiredDocuments.length
    const complianceScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0

    return {
      workerId,
      workerName: worker?.name || 'Unknown',
      isCompliant: missingDocuments.length === 0 && expiredDocuments.length === 0,
      missingDocuments,
      expiringDocuments,
      expiredDocuments,
      complianceScore
    }
  }, [workers, complianceDocs, complianceRules])

  const addComplianceDocument = useCallback(async (
    workerId: string,
    workerName: string,
    documentType: string,
    expiryDate: string
  ) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate)
    const status = determineDocumentStatus(expiryDate)

    const newDoc: ComplianceDocument = {
      id: `DOC-${Date.now()}`,
      workerId,
      workerName,
      documentType,
      expiryDate,
      status,
      daysUntilExpiry
    }

    setComplianceDocs(current => [...(current || []), newDoc])
    return newDoc
  }, [setComplianceDocs, calculateDaysUntilExpiry, determineDocumentStatus])

  const updateDocumentExpiry = useCallback(async (
    documentId: string,
    newExpiryDate: string
  ) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(newExpiryDate)
    const status = determineDocumentStatus(newExpiryDate)

    setComplianceDocs(current =>
      (current || []).map(doc =>
        doc.id === documentId
          ? { ...doc, expiryDate: newExpiryDate, daysUntilExpiry, status }
          : doc
      )
    )
  }, [setComplianceDocs, calculateDaysUntilExpiry, determineDocumentStatus])

  const getComplianceDashboard = useCallback((): ComplianceDashboard => {
    const activeWorkers = workers.filter(w => w.status === 'active')
    const complianceChecks = activeWorkers.map(w => checkWorkerCompliance(w.id))

    const compliantWorkers = complianceChecks.filter(c => c.isCompliant).length
    const nonCompliantWorkers = activeWorkers.length - compliantWorkers

    const documentsExpiringSoon = complianceDocs.filter(d => d.status === 'expiring').length
    const documentsExpired = complianceDocs.filter(d => d.status === 'expired').length

    const documentsByType = complianceDocs.reduce((acc, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalWorkers: activeWorkers.length,
      compliantWorkers,
      nonCompliantWorkers,
      complianceRate: activeWorkers.length > 0 ? (compliantWorkers / activeWorkers.length) * 100 : 0,
      documentsExpiringSoon,
      documentsExpired,
      documentsByType
    }
  }, [workers, complianceDocs, checkWorkerCompliance])

  const getRenewalAlerts = useCallback((daysAhead: number = 90): DocumentRenewalAlert[] => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

    return complianceDocs
      .filter(doc => {
        const expiry = new Date(doc.expiryDate)
        return expiry <= futureDate
      })
      .map(doc => {
        const daysUntilExpiry = calculateDaysUntilExpiry(doc.expiryDate)
        let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low'

        if (daysUntilExpiry < 0) urgency = 'critical'
        else if (daysUntilExpiry < 14) urgency = 'high'
        else if (daysUntilExpiry < 30) urgency = 'medium'

        return {
          documentId: doc.id,
          workerId: doc.workerId,
          workerName: doc.workerName,
          documentType: doc.documentType,
          expiryDate: doc.expiryDate,
          daysUntilExpiry,
          urgency
        }
      })
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  }, [complianceDocs, calculateDaysUntilExpiry])

  const getNonCompliantWorkers = useCallback((): ComplianceCheck[] => {
    const activeWorkers = workers.filter(w => w.status === 'active')
    return activeWorkers
      .map(w => checkWorkerCompliance(w.id))
      .filter(check => !check.isCompliant)
      .sort((a, b) => a.complianceScore - b.complianceScore)
  }, [workers, checkWorkerCompliance])

  const canWorkerBeAssigned = useCallback((workerId: string): boolean => {
    const check = checkWorkerCompliance(workerId)
    return check.isCompliant
  }, [checkWorkerCompliance])

  return {
    complianceDocs,
    complianceRules,
    checkWorkerCompliance,
    addComplianceDocument,
    updateDocumentExpiry,
    getComplianceDashboard,
    getRenewalAlerts,
    getNonCompliantWorkers,
    canWorkerBeAssigned,
    determineDocumentStatus
  }
}
