import { useCallback } from 'react'
import type { ComplianceDocument, ComplianceStatus } from '@/lib/types'

export function useComplianceDocsCrud(
  setComplianceDocs: (updater: (current: ComplianceDocument[]) => ComplianceDocument[]) => void,
  calculateDaysUntilExpiry: (expiryDate: string) => number,
  determineDocumentStatus: (expiryDate: string) => ComplianceStatus,
) {
  const addComplianceDocument = useCallback(async (
    workerId: string,
    workerName: string,
    documentType: string,
    expiryDate: string
  ) => {
    const newDoc: ComplianceDocument = {
      id: `DOC-${Date.now()}`,
      workerId, workerName, documentType, expiryDate,
      status: determineDocumentStatus(expiryDate),
      daysUntilExpiry: calculateDaysUntilExpiry(expiryDate),
    }
    setComplianceDocs(current => [...(current || []), newDoc])
    return newDoc
  }, [setComplianceDocs, calculateDaysUntilExpiry, determineDocumentStatus])

  const updateDocumentExpiry = useCallback(async (documentId: string, newExpiryDate: string) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(newExpiryDate)
    const status = determineDocumentStatus(newExpiryDate)
    setComplianceDocs(current =>
      (current || []).map(doc =>
        doc.id === documentId ? { ...doc, expiryDate: newExpiryDate, daysUntilExpiry, status } : doc
      )
    )
  }, [setComplianceDocs, calculateDaysUntilExpiry, determineDocumentStatus])

  return { addComplianceDocument, updateDocumentExpiry }
}
