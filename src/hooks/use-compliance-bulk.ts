import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { ComplianceDocument } from '@/lib/types'

type SetDocs = (updater: (prev: ComplianceDocument[]) => ComplianceDocument[]) => void

export function useComplianceBulk(setComplianceDocs: SetDocs) {
  const bulkCreateComplianceDocs = useCallback(
    async (docsData: Omit<ComplianceDocument, 'id'>[]) => {
      try {
        const newDocs = docsData.map(data => ({
          ...data,
          id: `compliance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }))
        await indexedDB.bulkCreate(STORES.COMPLIANCE_DOCS, newDocs)
        setComplianceDocs(current => [...current, ...newDocs])
        return newDocs
      } catch (error) {
        console.error('Failed to bulk create compliance documents:', error)
        throw error
      }
    },
    [setComplianceDocs]
  )

  const bulkUpdateComplianceDocs = useCallback(
    async (updates: { id: string; updates: Partial<ComplianceDocument> }[]) => {
      try {
        const updatedDocs = await Promise.all(
          updates.map(async ({ id, updates: data }) => {
            const existing = await indexedDB.read<ComplianceDocument>(
              STORES.COMPLIANCE_DOCS, id
            )
            if (!existing)
              throw new Error(`Compliance document ${id} not found`)
            return { ...existing, ...data }
          })
        )
        await indexedDB.bulkUpdate(STORES.COMPLIANCE_DOCS, updatedDocs)
        setComplianceDocs(current =>
          current.map(d => updatedDocs.find(u => u.id === d.id) ?? d)
        )
        return updatedDocs
      } catch (error) {
        console.error('Failed to bulk update compliance documents:', error)
        throw error
      }
    },
    [setComplianceDocs]
  )

  return { bulkCreateComplianceDocs, bulkUpdateComplianceDocs }
}
