import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from '@phosphor-icons/react'
import { useComplianceTracking } from '@/hooks'

export function ComplianceDemo() {
  const { complianceRules, getComplianceDashboard } = useComplianceTracking()
  const dashboard = getComplianceDashboard()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Compliance Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{dashboard.complianceRate.toFixed(1)}%</div><p className="text-xs text-muted-foreground mt-1">{dashboard.compliantWorkers} of {dashboard.totalWorkers} workers</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Expiring Soon</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{dashboard.documentsExpiringSoon}</div><p className="text-xs text-muted-foreground mt-1">Documents need renewal</p></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Expired</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{dashboard.documentsExpired}</div><p className="text-xs text-muted-foreground mt-1">Urgent action required</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Compliance Rules</CardTitle><CardDescription>Configured document requirements</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceRules.map(rule => (
              <div key={rule.documentType} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {rule.required
                    ? <CheckCircle className="h-5 w-5 text-success mt-0.5" weight="fill" />
                    : <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />}
                  <div>
                    <p className="font-medium">{rule.documentType}</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.required ? 'Required' : 'Optional'} · Warning at {rule.expiryWarningDays} days · Renewal lead time {rule.renewalLeadDays} days
                    </p>
                  </div>
                </div>
                {rule.required && <Badge>Required</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
