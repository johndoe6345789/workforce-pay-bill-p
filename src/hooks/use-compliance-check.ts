import { useMemo, useCallback } from 'react'
import type { ComplianceRule, ComplianceResult, ComplianceCheck } from './use-compliance-check.types'
import { defaultComplianceRules } from './use-compliance-check.rules'
import {
  runCheck as _runCheck,
  runAllChecks as _runAllChecks,
  getFailedChecks as _getFailedChecks,
  getCriticalChecks as _getCriticalChecks,
  hasFailures as _hasFailures,
  hasCriticalFailures as _hasCriticalFailures,
} from './use-compliance-check.fns'

export type { ComplianceRule, ComplianceResult, ComplianceCheck }

export function useComplianceCheck() {
  const defaultRules: ComplianceRule[] = useMemo(() => defaultComplianceRules, [])

  const runCheck = useCallback(
    (rule: ComplianceRule, data: unknown): ComplianceCheck => _runCheck(rule, data),
    []
  )

  const runAllChecks = useCallback(
    (rules: ComplianceRule[], data: unknown): ComplianceCheck[] => _runAllChecks(rules, data),
    []
  )

  const getFailedChecks = useCallback(
    (checks: ComplianceCheck[]) => _getFailedChecks(checks),
    []
  )

  const getCriticalChecks = useCallback(
    (checks: ComplianceCheck[]) => _getCriticalChecks(checks),
    []
  )

  const hasFailures = useCallback(
    (checks: ComplianceCheck[]) => _hasFailures(checks),
    []
  )

  const hasCriticalFailures = useCallback(
    (checks: ComplianceCheck[]) => _hasCriticalFailures(checks),
    []
  )

  return {
    defaultRules,
    runCheck,
    runAllChecks,
    getFailedChecks,
    getCriticalChecks,
    hasFailures,
    hasCriticalFailures,
  }
}
