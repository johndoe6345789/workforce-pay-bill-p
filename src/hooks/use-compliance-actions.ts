import { toast } from 'sonner'
import type { ComplianceDocument, ComplianceStatus, NewNotification } from '@/lib/types'

export function useComplianceActions(
  setComplianceDocs: (updater: (current: ComplianceDocument[]) => ComplianceDocument[]) => void,
  addNotification: (notification: NewNotification) => void,
) {
  const handleUploadDocument = (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => {
    const expiryDateObj = new Date(data.expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiryDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    let status: ComplianceStatus = 'valid'
    if (daysUntilExpiry < 0) status = 'expired'
    else if (daysUntilExpiry < 30) status = 'expiring'

    const newDoc: ComplianceDocument = {
      id: `DOC-${Date.now()}`,
      workerId: data.workerId,
      workerName: data.workerName,
      documentType: data.documentType,
      expiryDate: data.expiryDate,
      status,
      daysUntilExpiry
    }

    setComplianceDocs(current => [...current, newDoc])

    if (status === 'expiring' || status === 'expired') {
      addNotification({
        type: 'compliance',
        priority: status === 'expired' ? 'urgent' : 'high',
        title: status === 'expired' ? 'Document Expired' : 'Document Expiring Soon',
        message: `${data.documentType} for ${data.workerName} ${status === 'expired' ? 'has expired' : `expires in ${daysUntilExpiry} days`}`,
        relatedId: newDoc.id
      })
    }

    toast.success('Document uploaded successfully')
  }

  return { handleUploadDocument }
}
