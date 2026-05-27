import { useState, useCallback } from 'react'
import type {
  PAYESubmission,
  FPSData,
  RTIValidationResult,
  PAYEError,
  PAYEWarning,
} from './use-paye-integration.types'
import { validateFPSData } from './use-paye-integration.validate-fps'

export function usePAYEValidate(
  submissions: PAYESubmission[],
  fpsData: FPSData[],
) {
  const [isValidating, setIsValidating] = useState(false)

  const validateSubmission = useCallback(async (
    submissionId: string
  ): Promise<RTIValidationResult> => {
    setIsValidating(true)
    try {
      const submission = submissions.find(s => s.id === submissionId)
      if (!submission) {
        return {
          isValid: false,
          errors: [{
            code: 'SUBMISSION_NOT_FOUND',
            message: 'Submission not found',
            severity: 'error'
          }],
          warnings: [],
          canSubmit: false
        }
      }

      if (submission.type === 'FPS') {
        const fps = fpsData.find(f => f.submissionId === submissionId)
        if (!fps) {
          return {
            isValid: false,
            errors: [{
              code: 'FPS_DATA_NOT_FOUND',
              message: 'FPS data not found',
              severity: 'error'
            }],
            warnings: [],
            canSubmit: false
          }
        }

        const allErrors: PAYEError[] = []
        const allWarnings: PAYEWarning[] = []

        for (const employee of fps.employees) {
          const validation = validateFPSData(employee)
          allErrors.push(...validation.errors)
          allWarnings.push(...validation.warnings)
        }

        return {
          isValid: allErrors.length === 0,
          errors: allErrors,
          warnings: allWarnings,
          canSubmit: allErrors.length === 0
        }
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        canSubmit: true
      }
    } finally {
      setIsValidating(false)
    }
  }, [submissions, fpsData])

  return { isValidating, validateSubmission }
}
