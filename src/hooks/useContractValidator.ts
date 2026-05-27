import { useMemo } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet, RateCard, ValidationRule } from '@/lib/types'

export interface ValidationResult { isValid: boolean; errors: string[]; warnings: string[] }
export interface ValidatedTimesheet { timesheet: Timesheet; validation: ValidationResult }

function checkRuleViolation(timesheet: Timesheet, rule: ValidationRule): boolean {
  switch (rule.type) {
    case 'max-hours-per-day':
      if (timesheet.shifts) return Math.max(...timesheet.shifts.map(s => s.hours)) > rule.value
      return timesheet.hours / 5 > rule.value
    case 'max-hours-per-week':
      return timesheet.hours > rule.value
    case 'min-break':
      return timesheet.shifts ? timesheet.shifts.some(s => s.hours > 6) : false
    case 'max-consecutive-days':
      return false
    default:
      return false
  }
}

export function useContractValidator(timesheets: Timesheet[], rateCards: RateCard[]) {
  const { t } = useTranslation()

  const validatedTimesheets = useMemo<ValidatedTimesheet[]>(() =>
    timesheets.map(ts => {
      const errors: string[] = []
      const warnings: string[] = []
      const rateCard = rateCards.find(rc => rc.id === ts.rateCardId)

      if (!rateCard) {
        errors.push(t('contractValidator.noRateCard'))
        return { timesheet: ts, validation: { isValid: false, errors, warnings } }
      }

      rateCard.validationRules?.forEach(rule => {
        if (checkRuleViolation(ts, rule)) {
          rule.severity === 'error' ? errors.push(rule.message) : warnings.push(rule.message)
        }
      })

      if (!ts.rate || ts.rate < rateCard.standardRate * 0.5) {
        errors.push(t('contractValidator.rateTooLow', { rate: ts.rate || 0, minimum: (rateCard.standardRate * 0.5).toFixed(2) }))
      }
      if (ts.rate && ts.rate > rateCard.standardRate * 3) {
        warnings.push(t('contractValidator.rateTooHigh', { rate: ts.rate }))
      }

      return { timesheet: ts, validation: { isValid: errors.length === 0, errors, warnings } }
    }),
    [timesheets, rateCards, t]
  )

  const withErrors = validatedTimesheets.filter(v => !v.validation.isValid)
  const withWarnings = validatedTimesheets.filter(v => v.validation.isValid && v.validation.warnings.length > 0)
  const compliant = validatedTimesheets.filter(v => v.validation.isValid && v.validation.warnings.length === 0)

  return { withErrors, withWarnings, compliant }
}
