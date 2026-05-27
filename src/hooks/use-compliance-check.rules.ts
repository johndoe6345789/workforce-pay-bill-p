import { differenceInDays, parseISO } from 'date-fns'
import type { ComplianceRule } from './use-compliance-check.types'

interface DocExpiryData { expiryDate: string }
interface RateData { rate: number; minRate?: number; maxRate?: number }
interface HoursData { weeklyHours: number; maxHours?: number }

export const defaultComplianceRules: ComplianceRule[] = [
  {
    id: 'doc-expiry',
    name: 'Document Expiry Check',
    description: 'Checks if documents are expired or expiring soon',
    severity: 'error',
    checkFunction: (data: unknown) => {
      const doc = data as DocExpiryData
      const daysUntilExpiry = differenceInDays(parseISO(doc.expiryDate), new Date())
      if (daysUntilExpiry < 0) {
        return {
          passed: false,
          message: 'Document has expired',
          severity: 'critical' as const,
          details: { daysOverdue: Math.abs(daysUntilExpiry) },
        }
      } else if (daysUntilExpiry < 30) {
        return {
          passed: false,
          message: `Document expires in ${daysUntilExpiry} days`,
          severity: 'warning' as const,
          details: { daysUntilExpiry },
        }
      }
      return { passed: true, message: 'Document is valid', severity: 'info' as const }
    },
  },
  {
    id: 'rate-validation',
    name: 'Rate Validation',
    description: 'Validates that rates are within acceptable ranges',
    severity: 'warning',
    checkFunction: (data: unknown) => {
      const { rate, minRate = 0, maxRate = 10000 } = data as RateData
      if (rate < minRate) {
        return { passed: false, message: `Rate £${rate} is below minimum £${minRate}`, severity: 'error' as const }
      } else if (rate > maxRate) {
        return { passed: false, message: `Rate £${rate} exceeds maximum £${maxRate}`, severity: 'warning' as const }
      }
      return { passed: true, message: 'Rate is within acceptable range', severity: 'info' as const }
    },
  },
  {
    id: 'hours-validation',
    name: 'Working Hours Validation',
    description: 'Validates weekly working hours limits',
    severity: 'warning',
    checkFunction: (data: unknown) => {
      const { weeklyHours, maxHours = 48 } = data as HoursData
      if (weeklyHours > maxHours) {
        return {
          passed: false,
          message: `Weekly hours ${weeklyHours} exceed limit of ${maxHours}`,
          severity: 'error' as const,
          details: { excess: weeklyHours - maxHours },
        }
      } else if (weeklyHours > maxHours * 0.9) {
        return { passed: false, message: `Weekly hours ${weeklyHours} approaching limit`, severity: 'warning' as const }
      }
      return { passed: true, message: 'Working hours within limits', severity: 'info' as const }
    },
  },
]
