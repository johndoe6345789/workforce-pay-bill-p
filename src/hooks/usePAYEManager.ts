import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { usePAYEIntegration, type PAYESubmission } from '@/hooks/use-paye-integration'

export function usePAYEManager() {
  const [selectedSubmission, setSelectedSubmission] = useState<PAYESubmission | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('pending')

  const { fpsData, isValidating, isSubmitting, validateSubmission, submitToHMRC, generateRTIReport, getPendingSubmissions, getSubmittedSubmissions } = usePAYEIntegration()

  const pendingSubmissions = useMemo(() => getPendingSubmissions(), [getPendingSubmissions])
  const submittedSubmissions = useMemo(() => getSubmittedSubmissions(), [getSubmittedSubmissions])

  const handleValidate = async (submission: PAYESubmission) => {
    try {
      const result = await validateSubmission(submission.id)
      setValidationResult(result)
      setShowValidation(true)
      if (result.isValid) {
        toast.success('Validation passed', { description: 'RTI submission is ready to send to HMRC' })
      } else {
        toast.error('Validation failed', { description: `Found ${result.errors.length} error(s)` })
      }
    } catch (error) {
      toast.error('Validation error', { description: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const handleSubmit = async (submission: PAYESubmission) => {
    try {
      const result = await submitToHMRC(submission.id)
      if (result.success) {
        toast.success('Submitted to HMRC', { description: `Reference: ${result.hmrcReference}` })
      } else {
        toast.error('Submission failed', { description: result.errors?.[0]?.message || 'Unknown error' })
      }
    } catch (error) {
      toast.error('Submission error', { description: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const handleDownloadReport = (submission: PAYESubmission) => {
    const report = generateRTIReport(submission.id)
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RTI_${submission.type}_${submission.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded')
  }

  return {
    selectedSubmission, setSelectedSubmission,
    showValidation, setShowValidation,
    validationResult, activeTab, setActiveTab,
    fpsData, isValidating, isSubmitting,
    pendingSubmissions, submittedSubmissions,
    handleValidate, handleSubmit, handleDownloadReport,
  }
}
