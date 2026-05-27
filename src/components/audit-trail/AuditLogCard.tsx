import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import type { AuditLogEntry } from '@/components/AuditTrailViewer'

type AuditAction = AuditLogEntry['action']

const ACTION_CONFIG: Record<AuditAction, { color: string; labelKey: string }> = {
  create:  { color: 'bg-success/10 text-success border-success/20',       labelKey: 'auditTrail.actions.created' },
  update:  { color: 'bg-info/10 text-info border-info/20',                labelKey: 'auditTrail.actions.updated' },
  delete:  { color: 'bg-destructive/10 text-destructive border-destructive/20', labelKey: 'auditTrail.actions.deleted' },
  approve: { color: 'bg-success/10 text-success border-success/20',       labelKey: 'auditTrail.actions.approved' },
  reject:  { color: 'bg-destructive/10 text-destructive border-destructive/20', labelKey: 'auditTrail.actions.rejected' },
  send:    { color: 'bg-info/10 text-info border-info/20',                labelKey: 'auditTrail.actions.sent' },
  adjust:  { color: 'bg-warning/10 text-warning border-warning/20',       labelKey: 'auditTrail.actions.adjusted' },
  import:  { color: 'bg-accent/10 text-accent border-accent/20',          labelKey: 'auditTrail.actions.imported' },
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

interface Props { log: AuditLogEntry; showDate: boolean }

export function AuditLogCard({ log, showDate }: Props) {
  const { t } = useTranslation()
  const cfg = ACTION_CONFIG[log.action]

  return (
    <div>
      {showDate && (
        <div className="mb-3 mt-6 first:mt-0">
          <p className="text-sm font-medium text-muted-foreground">
            {new Date(log.timestamp).toLocaleDateString('en-US', DATE_FORMAT)}
          </p>
        </div>
      )}
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} className="text-primary" weight="bold" />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{log.userName}</span>
                    <Badge variant="outline" className={cn('text-xs', cfg.color)}>{t(cfg.labelKey)}</Badge>
                    <Badge variant="secondary" className="text-xs capitalize">{log.entity}</Badge>
                    <span className="text-sm text-muted-foreground">{log.entityName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}{log.ipAddress && ` • ${log.ipAddress}`}
                  </p>
                </div>
              </div>
              {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
              {log.changes && log.changes.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    {t('auditTrail.viewChanges', { count: log.changes.length })}
                  </summary>
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-border">
                    {log.changes.map((change, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="font-medium text-xs uppercase text-muted-foreground">{change.field}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-muted-foreground font-mono">{String(change.oldValue)}</span>
                          <span>→</span>
                          <span className="font-mono font-medium">{String(change.newValue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
