import type { FPSEmployee, RTIValidationResult } from './use-paye-integration.types'
import { collectFPSErrors, collectFPSWarnings } from './use-paye-integration.validate-fps.helpers'

export function validateFPSData(fps: Partial<FPSEmployee>): RTIValidationResult {
  const errors = collectFPSErrors(fps)
  const warnings = collectFPSWarnings(fps)
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canSubmit: errors.length === 0,
  }
}
