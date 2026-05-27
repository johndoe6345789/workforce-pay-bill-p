import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Warning, CheckCircle, XCircle, ShieldCheck } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'
import type { Timesheet, RateCard } from '@/lib/types'
import { useContractValidator } from '@/hooks/useContractValidator'
import { ContractValidationSummary } from '@/components/contract-validator/ContractValidationSummary'
import { TimesheetValidationCard } from '@/components/contract-validator/TimesheetValidationCard'

interface Props { timesheets: Timesheet[]; rateCards: RateCard[] }

export function ContractValidator({ timesheets, rateCards }: Props) {
  const { t } = useTranslation()
  const { withErrors, withWarnings, compliant } = useContractValidator(timesheets, rateCards)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{t('contractValidator.title')}</h2>
        <p className="text-muted-foreground mt-1">{t('contractValidator.subtitle')}</p>
      </div>

      <ContractValidationSummary errorCount={withErrors.length} warningCount={withWarnings.length} compliantCount={compliant.length} />

      {withErrors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><XCircle size={20} className="text-destructive" weight="fill" />{t('contractValidator.errorDescription')}</CardTitle>
            <CardDescription>{t('contractValidator.errorDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {withErrors.map(({ timesheet, validation }) => (
              <TimesheetValidationCard key={timesheet.id} timesheet={timesheet} messages={validation.errors} type="error" />
            ))}
          </CardContent>
        </Card>
      )}

      {withWarnings.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Warning size={20} className="text-warning" weight="fill" />{t('contractValidator.reviewRecommended')}</CardTitle>
            <CardDescription>{t('contractValidator.warningDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {withWarnings.map(({ timesheet, validation }) => (
              <TimesheetValidationCard key={timesheet.id} timesheet={timesheet} messages={validation.warnings} type="warning" />
            ))}
          </CardContent>
        </Card>
      )}

      {compliant.length > 0 && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><CheckCircle size={20} className="text-success" weight="fill" />{t('contractValidator.readyToProcess')}</CardTitle>
            <CardDescription>{t('contractValidator.compliantDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compliant.slice(0, 5).map(({ timesheet }) => (
                <div key={timesheet.id} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <CheckCircle size={20} className="text-success" weight="fill" />
                    <div><p className="font-medium">{timesheet.workerName}</p><p className="text-sm text-muted-foreground">{timesheet.clientName}</p></div>
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
