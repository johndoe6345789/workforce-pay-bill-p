import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import type { ComplianceDocument } from '@/lib/types'

export function useComplianceCrud() {
  const [complianceDocs, setComplianceDocs] = useIndexedDBState<ComplianceDocument[]>(STORES.COMPLIANCE_DOCS, [])

  const createComplianceDoc = useCallback(async (doc: Omit<ComplianceDocument, 'id'>) => {
    const newDoc: ComplianceDocument = {
      ...doc,
      id: `compliance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    
    try {
      await indexedDB.create(STORES.COMPLIANCE_DOCS, newDoc)
      setComplianceDocs(current => [...current, newDoc])
      return newDoc
    } catch (error) {
      console.error('Failed to create compliance document:', error)
      throw error
    }
  }, [setComplianceDocs])

  const updateComplianceDoc = useCallback(async (id: string, updates: Partial<ComplianceDocument>) => {
    try {
      const existing = await indexedDB.read<ComplianceDocument>(STORES.COMPLIANCE_DOCS, id)
      if (!existing) throw new Error('Compliance document not found')

      const updated = { ...existing, ...updates }
      await indexedDB.update(STORES.COMPLIANCE_DOCS, updated)
      
      setComplianceDocs(current =>
        current.map(d => d.id === id ? updated : d)
      )
      return updated
    } catch (error) {
      console.error('Failed to update compliance document:', error)
      throw error
    }
  }, [setComplianceDocs])

  const deleteComplianceDoc = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(STORES.COMPLIANCE_DOCS, id)
      setComplianceDocs(current => current.filter(d => d.id !== id))
    } catch (error) {
      console.error('Failed to delete compliance document:', error)
      throw error
    }
  }, [setComplianceDocs])

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
      return await indexedDB.readByIndex<ComplianceDocument>(STORES.COMPLIANCE_DOCS, 'workerId', workerId)
    } catch (error) {
      console.error('Failed to get compliance documents by worker:', error)
      throw error
    }
  }, [])

  const getComplianceDocsByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<ComplianceDocument>(STORES.COMPLIANCE_DOCS, 'status', status)
    } catch (error) {
      console.error('Failed to get compliance documents by status:', error)
      throw error
    }
  }, [])

  const bulkCreateComplianceDocs = useCallback(async (docsData: Omit<ComplianceDocument, 'id'>[]) => {
    try {
      const newDocs = docsData.map(data => ({
        ...data,
        id: `compliance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }))

      await indexedDB.bulkCreate(STORES.COMPLIANCE_DOCS, newDocs)
      setComplianceDocs(current => [...current, ...newDocs])
      return newDocs
    } catch (error) {
      console.error('Failed to bulk create compliance documents:', error)
      throw error
    }
  }, [setComplianceDocs])

  const bulkUpdateComplianceDocs = useCallback(async (updates: { id: string; updates: Partial<ComplianceDocument> }[]) => {
    try {
      const updatedDocs = await Promise.all(
        updates.map(async ({ id, updates: data }) => {
          const existing = await indexedDB.read<ComplianceDocument>(STORES.COMPLIANCE_DOCS, id)
          if (!existing) throw new Error(`Compliance document ${id} not found`)
          return { ...existing, ...data }
        })
      )

      await indexedDB.bulkUpdate(STORES.COMPLIANCE_DOCS, updatedDocs)
      
      setComplianceDocs(current =>
        current.map(d => {
          const updated = updatedDocs.find(u => u.id === d.id)
          return updated || d
        })
      )
      
      return updatedDocs
    } catch (error) {
      console.error('Failed to bulk update compliance documents:', error)
      throw error
    }
  }, [setComplianceDocs])

  return {
    complianceDocs,
    createComplianceDoc,
    updateComplianceDoc,
    deleteComplianceDoc,
    getComplianceDocById,
    getComplianceDocsByWorker,
    getComplianceDocsByStatus,
    bulkCreateComplianceDocs,
    bulkUpdateComplianceDocs
  }
}
