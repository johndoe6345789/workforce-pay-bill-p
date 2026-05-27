export interface ComplianceRule {
  documentType: string
  required: boolean
  expiryWarningDays: number
  renewalLeadDays: number
  applicableWorkerTypes?: string[]
}

export interface ComplianceCheck {
  workerId: string
  workerName: string
  isCompliant: boolean
  missingDocuments: string[]
  expiringDocuments: import('@/lib/types').ComplianceDocument[]
  expiredDocuments: import('@/lib/types').ComplianceDocument[]
  complianceScore: number
}

export interface ComplianceDashboard {
  totalWorkers: number
  compliantWorkers: number
  nonCompliantWorkers: number
  complianceRate: number
  documentsExpiringSoon: number
  documentsExpired: number
  documentsByType: Record<string, number>
}

export interface DocumentRenewalAlert {
  documentId: string
  workerId: string
  workerName: string
  documentType: string
  expiryDate: string
  daysUntilExpiry: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
}

export const DEFAULT_COMPLIANCE_RULES: ComplianceRule[] = [
  { documentType: 'Right to Work', required: true, expiryWarningDays: 30, renewalLeadDays: 60 },
  { documentType: 'DBS Check', required: true, expiryWarningDays: 45, renewalLeadDays: 90 },
  { documentType: 'Professional Qualification', required: true, expiryWarningDays: 60, renewalLeadDays: 90 },
  { documentType: 'Health & Safety Training', required: true, expiryWarningDays: 30, renewalLeadDays: 60 },
  { documentType: 'First Aid Certificate', required: false, expiryWarningDays: 30, renewalLeadDays: 60 },
  { documentType: 'Driving License', required: false, expiryWarningDays: 60, renewalLeadDays: 90 },
]
