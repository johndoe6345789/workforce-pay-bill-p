import { useMemo, useCallback } from 'react'
import { differenceInDays, parseISO } from 'date-fns'

export interface ComplianceRule {
  id: string
  name: string
  description: string
  checkFunction: (data: any) => ComplianceResult
  severity: 'info' | 'warning' | 'error' | 'critical'
  autoResolve?: boolean
}

export interface ComplianceResult {
  passed: boolean
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  details?: Record<string, any>
}

export interface ComplianceCheck {
  ruleId: string
  ruleName: string
  result: ComplianceResult
  timestamp: string
}

export function useComplianceCheck() {
  const defaultRules: ComplianceRule[] = useMemo(
    () => [
      {
        id: 'doc-expiry',
        name: 'Document Expiry Check',
        description: 'Checks if documents are expired or expiring soon',
        severity: 'error',
        checkFunction: (doc: { expiryDate: string }) => {
          const daysUntilExpiry = differenceInDays(
            parseISO(doc.expiryDate),
            new Date()
          )

          if (daysUntilExpiry < 0) {
            return {
              passed: false,
              message: 'Document has expired',
              severity: 'critical',
              details: { daysOverdue: Math.abs(daysUntilExpiry) },
            }
          } else if (daysUntilExpiry < 30) {
            return {
              passed: false,
              message: `Document expires in ${daysUntilExpiry} days`,
              severity: 'warning',
              details: { daysUntilExpiry },
            }
          }

          return {
            passed: true,
            message: 'Document is valid',
            severity: 'info',
          }
        },
      },
      {
        id: 'rate-validation',
        name: 'Rate Validation',
        description: 'Validates that rates are within acceptable ranges',
        severity: 'warning',
        checkFunction: (data: { rate: number; minRate?: number; maxRate?: number }) => {
          const { rate, minRate = 0, maxRate = 10000 } = data

          if (rate < minRate) {
            return {
              passed: false,
              message: `Rate £${rate} is below minimum £${minRate}`,
              severity: 'error',
            }
          } else if (rate > maxRate) {
            return {
              passed: false,
              message: `Rate £${rate} exceeds maximum £${maxRate}`,
              severity: 'warning',
            }
          }

          return {
            passed: true,
            message: 'Rate is within acceptable range',
            severity: 'info',
          }
        },
      },
      {
        id: 'hours-validation',
        name: 'Working Hours Validation',
        description: 'Validates weekly working hours limits',
        severity: 'warning',
        checkFunction: (data: { weeklyHours: number; maxHours?: number }) => {
          const { weeklyHours, maxHours = 48 } = data

          if (weeklyHours > maxHours) {
            return {
              passed: false,
              message: `Weekly hours ${weeklyHours} exceed limit of ${maxHours}`,
              severity: 'error',
              details: { excess: weeklyHours - maxHours },
            }
          } else if (weeklyHours > maxHours * 0.9) {
            return {
              passed: false,
              message: `Weekly hours ${weeklyHours} approaching limit`,
              severity: 'warning',
            }
          }

          return {
            passed: true,
            message: 'Working hours within limits',
            severity: 'info',
          }
        },
      },
    ],
    []
  )

  const runCheck = useCallback(
    (rule: ComplianceRule, data: any): ComplianceCheck => {
      const result = rule.checkFunction(data)
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        result,
        timestamp: new Date().toISOString(),
      }
    },
    []
  )

  const runAllChecks = useCallback(
    (rules: ComplianceRule[], data: any): ComplianceCheck[] => {
      return rules.map((rule) => runCheck(rule, data))
    },
    [runCheck]
  )

  const getFailedChecks = useCallback((checks: ComplianceCheck[]) => {
    return checks.filter((check) => !check.result.passed)
  }, [])

  const getCriticalChecks = useCallback((checks: ComplianceCheck[]) => {
    return checks.filter((check) => check.result.severity === 'critical')
  }, [])

  const hasFailures = useCallback((checks: ComplianceCheck[]) => {
    return checks.some((check) => !check.result.passed)
  }, [])

  const hasCriticalFailures = useCallback((checks: ComplianceCheck[]) => {
    return checks.some(
      (check) => !check.result.passed && check.result.severity === 'critical'
    )
  }, [])

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
