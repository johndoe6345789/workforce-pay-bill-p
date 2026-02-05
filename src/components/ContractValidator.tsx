import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Warning, CheckCircle, XCircle, ShieldCheck } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet, RateCard, ValidationRule } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ContractValidatorProps {
  timesheets: Timesheet[]
  rateCards: RateCard[]
}

export function ContractValidator({ timesheets, rateCards }: ContractValidatorProps) {
  const { t } = useTranslation()
  const validateTimesheet = (timesheet: Timesheet): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } => {
    const errors: string[] = []
    const warnings: string[] = []

    const rateCard = rateCards.find(rc => rc.id === timesheet.rateCardId)
    
    if (!rateCard) {
      errors.push(t('contractValidator.noRateCard'))
      return { isValid: false, errors, warnings }
    }

    if (rateCard.validationRules) {
      rateCard.validationRules.forEach(rule => {
        const violated = checkRuleViolation(timesheet, rule)
        if (violated) {
          if (rule.severity === 'error') {
            errors.push(rule.message)
          } else {
            warnings.push(rule.message)
          }
        }
      })
    }

    if (!timesheet.rate || timesheet.rate < rateCard.standardRate * 0.5) {
      errors.push(t('contractValidator.rateTooLow', { rate: timesheet.rate || 0, minimum: (rateCard.standardRate * 0.5).toFixed(2) }))
    }

    if (timesheet.rate && timesheet.rate > rateCard.standardRate * 3) {
      warnings.push(t('contractValidator.rateTooHigh', { rate: timesheet.rate }))
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const checkRuleViolation = (timesheet: Timesheet, rule: ValidationRule): boolean => {
    switch (rule.type) {
      case 'max-hours-per-day':
        if (timesheet.shifts) {
          const maxDailyHours = Math.max(...timesheet.shifts.map(s => s.hours))
          return maxDailyHours > rule.value
        }
        return timesheet.hours / 5 > rule.value
      
      case 'max-hours-per-week':
        return timesheet.hours > rule.value
      
      case 'min-break':
        if (timesheet.shifts) {
          const hasLongShift = timesheet.shifts.some(s => s.hours > 6)
          return hasLongShift
        }
        return false
      
      case 'max-consecutive-days':
        return false
      
      default:
        return false
    }
  }

  const validatedTimesheets = timesheets.map(ts => ({
    timesheet: ts,
    validation: validateTimesheet(ts)
  }))

  const withErrors = validatedTimesheets.filter(v => !v.validation.isValid)
  const withWarnings = validatedTimesheets.filter(v => v.validation.isValid && v.validation.warnings.length > 0)
  const compliant = validatedTimesheets.filter(v => v.validation.isValid && v.validation.warnings.length === 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{t('contractValidator.title')}</h2>
        <p className="text-muted-foreground mt-1">{t('contractValidator.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle size={18} className="text-destructive" weight="fill" />
              {t('contractValidator.validationErrors')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{withErrors.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('contractValidator.validationErrorsBlocked')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Warning size={18} className="text-warning" weight="fill" />
              {t('contractValidator.warnings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{withWarnings.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('contractValidator.warningsReview')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-success" weight="fill" />
              {t('contractValidator.compliant')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{compliant.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('contractValidator.compliantReady')}</p>
          </CardContent>
        </Card>
      </div>

      {withErrors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle size={20} className="text-destructive" weight="fill" />
              {t('contractValidator.errorDescription')}
            </CardTitle>
            <CardDescription>
              {t('contractValidator.errorDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {withErrors.map(({ timesheet, validation }) => (
              <Card key={timesheet.id} className="bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{timesheet.workerName}</h3>
                        <Badge variant="destructive">{t('contractValidator.error')}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.client')}</p>
                          <p className="font-medium">{timesheet.clientName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.weekEnding')}</p>
                          <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.hours')}</p>
                          <p className="font-medium font-mono">{timesheet.hours}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mt-3">
                        {validation.errors.map((error, idx) => (
                          <Alert key={idx} variant="destructive" className="py-2">
                            <AlertDescription className="text-sm">{error}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {t('contractValidator.fixIssues')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {withWarnings.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Warning size={20} className="text-warning" weight="fill" />
              {t('contractValidator.reviewRecommended')}
            </CardTitle>
            <CardDescription>
              {t('contractValidator.warningDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {withWarnings.map(({ timesheet, validation }) => (
              <Card key={timesheet.id} className="bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{timesheet.workerName}</h3>
                        <Badge variant="warning">{t('contractValidator.warning')}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.client')}</p>
                          <p className="font-medium">{timesheet.clientName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.weekEnding')}</p>
                          <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('contractValidator.hours')}</p>
                          <p className="font-medium font-mono">{timesheet.hours}</p>
                        </div>
                      </div>
                      <div className="space-y-1 mt-3">
                        {validation.warnings.map((warning, idx) => (
                          <Alert key={idx} className="py-2 border-warning">
                            <AlertDescription className="text-sm">{warning}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {t('contractValidator.review')}
                      </Button>
                      <Button size="sm" style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                        {t('contractValidator.approveAnyway')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {compliant.length > 0 && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle size={20} className="text-success" weight="fill" />
              {t('contractValidator.readyToProcess')}
            </CardTitle>
            <CardDescription>
              {t('contractValidator.compliantDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compliant.slice(0, 5).map(({ timesheet }) => (
                <div key={timesheet.id} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <CheckCircle size={20} className="text-success" weight="fill" />
                    <div>
                      <p className="font-medium">{timesheet.workerName}</p>
                      <p className="text-sm text-muted-foreground">{timesheet.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">{timesheet.hours}h</p>
                    <p className="text-sm text-muted-foreground">£{timesheet.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {compliant.length > 5 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  {t('contractValidator.moreCompliantTimesheets', { count: compliant.length - 5 })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
