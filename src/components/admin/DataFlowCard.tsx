import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DATA_FLOW_STEPS } from '@/data/data-admin-view-data'

interface Props {
  t: (key: string) => string
}

export function DataFlowCard({ t }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dataAdmin.dataFlow')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {DATA_FLOW_STEPS.map(({ titleKey, descKey }, i) => (
            <div key={titleKey} className="flex items-start gap-3">
              <Badge className="mt-0.5">{i + 1}</Badge>
              <div>
                <p className="font-medium text-sm">{t(titleKey)}</p>
                <p className="text-xs text-muted-foreground">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
