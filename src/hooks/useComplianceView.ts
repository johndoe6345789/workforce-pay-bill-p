import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useDataExport } from '@/hooks/use-data-export'
import { useTranslation } from '@/hooks/use-translation'
import type { ComplianceDocument } from '@/lib/types'
import { DEFAULT_UPLOAD_FORM, type UploadForm } from './useComplianceView.types'
import { buildComplianceFields } from './useComplianceView.fields'

export { DEFAULT_UPLOAD_FORM, type UploadForm } from './useComplianceView.types'

interface UseComplianceViewOptions {
  complianceDocs: ComplianceDocument[]
  onUploadDocument: (data: Omit<UploadForm, 'workerId'> & { workerId: string }) => void
}

export function useComplianceView({ complianceDocs, onUploadDocument }: UseComplianceViewOptions) {
  const { t } = useTranslation()
  const { exportData } = useDataExport()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<ComplianceDocument | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<ComplianceDocument[]>([])
  const [uploadForm, setUploadForm] = useState<UploadForm>(DEFAULT_UPLOAD_FORM)

  useEffect(() => { setFilteredDocs(complianceDocs) }, [complianceDocs])

  const handleResultsChange = useCallback((results: ComplianceDocument[]) => {
    setFilteredDocs(results)
  }, [])

  const handleExport = useCallback((format: 'csv' | 'json' | 'xlsx') => {
    try {
      const rows = filteredDocs.map(doc => ({
        workerId: doc.workerId,
        workerName: doc.workerName,
        documentType: doc.documentType,
        status: doc.status,
        expiryDate: doc.expiryDate,
        daysUntilExpiry: doc.daysUntilExpiry,
      }))
      exportData(rows, { filename: `compliance-documents-${new Date().toISOString().split('T')[0]}`, format })
      toast.success(t('common.exportSuccess', { format: format.toUpperCase() }))
    } catch {
      toast.error(t('common.exportError'))
    }
  }, [filteredDocs, exportData, t])

  const handleSubmitUpload = () => {
    if (!uploadForm.workerName || !uploadForm.documentType || !uploadForm.expiryDate) {
      toast.error(t('compliance.uploadDialog.fillAllFields'))
      return
    }
    onUploadDocument({
      workerId: uploadForm.workerId || `W-${Date.now()}`,
      workerName: uploadForm.workerName,
      documentType: uploadForm.documentType,
      expiryDate: uploadForm.expiryDate,
    })
    setUploadForm(DEFAULT_UPLOAD_FORM)
    setIsUploadOpen(false)
  }

  const complianceFields = buildComplianceFields(t)
  const expiringDocs = filteredDocs.filter(d => d.status === 'expiring')
  const expiredDocs = filteredDocs.filter(d => d.status === 'expired')
  const validDocs = filteredDocs.filter(d => d.status === 'valid')

  return {
    t, isUploadOpen, setIsUploadOpen, viewingDocument, setViewingDocument,
    filteredDocs, uploadForm, setUploadForm, handleResultsChange, handleExport,
    handleSubmitUpload, complianceFields, expiringDocs, expiredDocs, validDocs,
  }
}
