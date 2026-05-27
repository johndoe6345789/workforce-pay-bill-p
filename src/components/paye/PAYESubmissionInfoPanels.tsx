import { Grid } from '@/components/ui/grid'
import { INCLUSIONS, EMPLOYER_FIELDS } from '@/data/paye-submission-config'
import type { usePAYEIntegration } from '@/hooks/use-paye-integration'

interface Props {
  payeConfig: ReturnType<typeof usePAYEIntegration>['payeConfig']
}

export function PAYESubmissionInfoPanels({ payeConfig }: Props) {
  return (
    <>
      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <div className="font-semibold text-sm">Employer Details</div>
        <Grid cols={2} gap={3}>
          {EMPLOYER_FIELDS.map(({ label, key }) => (
            <div key={key}>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-sm font-mono">{String(payeConfig[key] ?? '')}</div>
            </div>
          ))}
        </Grid>
      </div>

      <div className="p-4 border border-border rounded-lg space-y-3">
        <div className="font-semibold text-sm">What will be included?</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {INCLUSIONS.map(item => (
            <li key={item} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
