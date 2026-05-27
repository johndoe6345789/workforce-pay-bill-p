import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useDataExport } from '@/hooks/use-data-export'
import { useTranslation } from '@/hooks/use-translation'
import type { ComplianceDocument } from '@/lib/types'
import type { FilterField } from '@/components/AdvancedSearch'

export const DEFAULT_UPLOAD_FORM = {
  workerId: '',
  workerName: '',
  documentType: '',
  expiryDate: '',
}

export type UploadForm = typeof DEFAULT_UPLOAD_FORM

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

  useEffect(() => {
    setFilteredDocs(complianceDocs)
  }, [complianceDocs])

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
      exportData(rows, {
        filename: `compliance-documents-${new Date().toISOString().split('T')[0]}`,
        format,
      })
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

  const complianceFields: FilterField[] = [
    { name: 'workerName', label: t('compliance.workerName'), type: 'text' },
    { name: 'documentType', label: t('compliance.documentType'), type: 'select', options: [
      { value: 'DBS Check', label: t('compliance.documentTypes.dbsCheck') },
      { value: 'Right to Work', label: t('compliance.documentTypes.rightToWork') },
      { value: 'Professional License', label: t('compliance.documentTypes.professionalLicense') },
      { value: 'First Aid Certificate', label: t('compliance.documentTypes.firstAidCertificate') },
      { value: 'Driving License', label: t('compliance.documentTypes.drivingLicense') },
      { value: 'Passport', label: t('compliance.documentTypes.passport') },
    ]},
    { name: 'status', label: t('common.status'), type: 'select', options: [
      { value: 'valid', label: t('compliance.status.valid') },
      { value: 'expiring', label: t('compliance.status.expiring') },
      { value: 'expired', label: t('compliance.status.expired') },
    ]},
    { name: 'daysUntilExpiry', label: t('compliance.daysUntilExpiry'), type: 'number' },
    { name: 'expiryDate', label: t('compliance.expiryDate'), type: 'date' },
  ]

  const expiringDocs = filteredDocs.filter(d => d.status === 'expiring')
  const expiredDocs = filteredDocs.filter(d => d.status === 'expired')
  const validDocs = filteredDocs.filter(d => d.status === 'valid')

  return {
    t,
    isUploadOpen, setIsUploadOpen,
    viewingDocument, setViewingDocument,
    filteredDocs,
    uploadForm, setUploadForm,
    handleResultsChange,
    handleExport,
    handleSubmitUpload,
    complianceFields,
    expiringDocs,
    expiredDocs,
    validDocs,
  }
}
