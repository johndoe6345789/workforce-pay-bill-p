export type {
  PAYESubmission, PAYEError, PAYEWarning,
  FPSData, FPSEmployee, EmployeeAddress, StarterDeclaration,
  EPSData, RTIValidationResult, PAYEConfig,
} from './use-paye-integration.types'

import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { DEFAULT_PAYE_CONFIG } from './use-paye-integration.types'
import type { PAYESubmission, FPSData, EPSData, PAYEConfig } from './use-paye-integration.types'
import { calculateApprenticeshipLevy, calculateTaxMonth, calculateTaxYear } from './use-paye-integration.calc'
import { validateFPSData } from './use-paye-integration.validate-fps'
import { usePAYEFpsEps } from './use-paye-fps-eps'
import { usePAYESubmissionCreate } from './use-paye-submission-create'
import { usePAYEValidate } from './use-paye-validate'
import { usePAYESubmit } from './use-paye-submit'
import { usePAYEQueries } from './use-paye-queries'

export function usePAYEIntegration(config: Partial<PAYEConfig> = {}) {
  const [submissions = [], setSubmissions] = useKV<PAYESubmission[]>('paye-submissions', [])
  const [fpsData = [], setFpsData] = useKV<FPSData[]>('paye-fps-data', [])
  const [epsData = [], setEpsData] = useKV<EPSData[]>('paye-eps-data', [])

  const payeConfig = useMemo(() => ({ ...DEFAULT_PAYE_CONFIG, ...config }), [config])

  const { createFPS, createEPS } = usePAYEFpsEps(payeConfig, setFpsData, setEpsData)
  const { createPAYESubmission } = usePAYESubmissionCreate(payeConfig, fpsData, setSubmissions)
  const { isValidating, validateSubmission } = usePAYEValidate(submissions, fpsData)
  const { isSubmitting, submitToHMRC } = usePAYESubmit(setSubmissions, validateSubmission)
  const queries = usePAYEQueries(submissions, fpsData)

  return {
    payeConfig,
    submissions,
    fpsData,
    epsData,
    isValidating,
    isSubmitting,
    createFPS,
    createEPS,
    validateFPSData,
    validateSubmission,
    submitToHMRC,
    createPAYESubmission,
    calculateApprenticeshipLevy,
    calculateTaxMonth,
    calculateTaxYear,
    ...queries,
  }
}
