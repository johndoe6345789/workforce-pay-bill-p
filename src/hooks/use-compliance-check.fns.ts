import type { ComplianceRule, ComplianceCheck } from './use-compliance-check.types'

export function runCheck(rule: ComplianceRule, data: unknown): ComplianceCheck {
  const result = rule.checkFunction(data)
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    result,
    timestamp: new Date().toISOString(),
  }
}

export function runAllChecks(rules: ComplianceRule[], data: unknown): ComplianceCheck[] {
  return rules.map(rule => runCheck(rule, data))
}

export function getFailedChecks(checks: ComplianceCheck[]): ComplianceCheck[] {
  return checks.filter(check => !check.result.passed)
}

export function getCriticalChecks(checks: ComplianceCheck[]): ComplianceCheck[] {
  return checks.filter(check => check.result.severity === 'critical')
}

export function hasFailures(checks: ComplianceCheck[]): boolean {
  return checks.some(check => !check.result.passed)
}

export function hasCriticalFailures(checks: ComplianceCheck[]): boolean {
  return checks.some(check => !check.result.passed && check.result.severity === 'critical')
}
