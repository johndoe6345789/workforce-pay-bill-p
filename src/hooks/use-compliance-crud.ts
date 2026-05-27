import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import { useComplianceWrite } from './use-compliance-write'
import { useComplianceBulk } from './use-compliance-bulk'
import type { ComplianceDocument } from '@/lib/types'

export function useComplianceCrud() {
  const [complianceDocs, setComplianceDocs] = useIndexedDBState<
    ComplianceDocument[]
  >(STORES.COMPLIANCE_DOCS, [])

  const { createComplianceDoc, updateComplianceDoc, deleteComplianceDoc } =
    useComplianceWrite(setComplianceDocs)
  const { bulkCreateComplianceDocs, bulkUpdateComplianceDocs } =
    useComplianceBulk(setComplianceDocs)

  const getComplianceDocById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<ComplianceDocument>(STORES.COMPLIANCE_DOCS, id)
    } catch (error) {
      console.error('Failed to get compliance document:', error)
      throw error
    }
  }, [])

  const getComplianceDocsByWorker = useCallback(async (workerId: string) => {
    try {
      return await indexedDB.readByIndex<ComplianceDocument>(
        STORES.COMPLIANCE_DOCS, 'workerId', workerId
      )
    } catch (error) {
      console.error('Failed to get compliance documents by worker:', error)
      throw error
    }
  }, [])

  const getComplianceDocsByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<ComplianceDocument>(
        STORES.COMPLIANCE_DOCS, 'status', status
      )
    } catch (error) {
      console.error('Failed to get compliance documents by status:', error)
      throw error
    }
  }, [])

  return {
    complianceDocs,
    createComplianceDoc,
    updateComplianceDoc,
    deleteComplianceDoc,
    getComplianceDocById,
    getComplianceDocsByWorker,
    getComplianceDocsByStatus,
    bulkCreateComplianceDocs,
    bulkUpdateComplianceDocs,
  }
}
