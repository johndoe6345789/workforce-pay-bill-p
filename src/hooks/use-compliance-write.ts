import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { ComplianceDocument } from '@/lib/types'

type SetDocs = (updater: (prev: ComplianceDocument[]) => ComplianceDocument[]) => void

export function useComplianceWrite(setComplianceDocs: SetDocs) {
  const createComplianceDoc = useCallback(
    async (doc: Omit<ComplianceDocument, 'id'>) => {
      const newDoc: ComplianceDocument = {
        ...doc,
        id: `compliance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
      try {
        await indexedDB.create(STORES.COMPLIANCE_DOCS, newDoc)
        setComplianceDocs(current => [...current, newDoc])
        return newDoc
      } catch (error) {
        console.error('Failed to create compliance document:', error)
        throw error
      }
    },
    [setComplianceDocs]
  )

  const updateComplianceDoc = useCallback(
    async (id: string, updates: Partial<ComplianceDocument>) => {
      try {
        const existing = await indexedDB.read<ComplianceDocument>(
          STORES.COMPLIANCE_DOCS, id
        )
        if (!existing) throw new Error('Compliance document not found')
        const updated = { ...existing, ...updates }
        await indexedDB.update(STORES.COMPLIANCE_DOCS, updated)
        setComplianceDocs(current =>
          current.map(d => (d.id === id ? updated : d))
        )
        return updated
      } catch (error) {
        console.error('Failed to update compliance document:', error)
        throw error
      }
    },
    [setComplianceDocs]
  )

  const deleteComplianceDoc = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(STORES.COMPLIANCE_DOCS, id)
        setComplianceDocs(current => current.filter(d => d.id !== id))
      } catch (error) {
        console.error('Failed to delete compliance document:', error)
        throw error
      }
    },
    [setComplianceDocs]
  )

  return { createComplianceDoc, updateComplianceDoc, deleteComplianceDoc }
}
