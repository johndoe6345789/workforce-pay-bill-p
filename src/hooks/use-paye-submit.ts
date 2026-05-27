import { useState, useCallback } from 'react'
import type { PAYESubmission, PAYEError, RTIValidationResult } from './use-paye-integration.types'

export function usePAYESubmit(
  setSubmissions: (updater: (current: PAYESubmission[]) => PAYESubmission[]) => void,
  validateSubmission: (submissionId: string) => Promise<RTIValidationResult>,
) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitToHMRC = useCallback(async (
    submissionId: string
  ): Promise<{ success: boolean; hmrcReference?: string; errors?: PAYEError[] }> => {
    setIsSubmitting(true)
    try {
      const validation = await validateSubmission(submissionId)

      if (!validation.canSubmit) {
        return {
          success: false,
          errors: validation.errors
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      const hmrcReference = `HMRC-${Date.now()}`

      setSubmissions(current =>
        (current || []).map(sub =>
          sub.id === submissionId
            ? {
                ...sub,
                status: 'submitted',
                submittedDate: new Date().toISOString(),
                hmrcReference,
                errors: validation.errors.length > 0 ? validation.errors : undefined,
                warnings: validation.warnings.length > 0 ? validation.warnings : undefined
              }
            : sub
        )
      )

      setTimeout(() => {
        setSubmissions(current =>
          (current || []).map(sub =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: 'accepted',
                  acceptedDate: new Date().toISOString()
                }
              : sub
          )
        )
      }, 3000)

      return {
        success: true,
        hmrcReference
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'SUBMISSION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        }]
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [validateSubmission, setSubmissions])

  return { isSubmitting, submitToHMRC }
}
