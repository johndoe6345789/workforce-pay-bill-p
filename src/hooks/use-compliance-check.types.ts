export interface ComplianceRule {
  id: string
  name: string
  description: string
  checkFunction: (data: unknown) => ComplianceResult
  severity: 'info' | 'warning' | 'error' | 'critical'
  autoResolve?: boolean
}

export interface ComplianceResult {
  passed: boolean
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  details?: Record<string, unknown>
}

export interface ComplianceCheck {
  ruleId: string
  ruleName: string
  result: ComplianceResult
  timestamp: string
}
