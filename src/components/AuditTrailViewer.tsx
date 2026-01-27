import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { ClockCounterClockwise, MagnifyingGlass, Funnel, Download, User, FileText } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'

type AuditAction = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'send' | 'adjust' | 'import'
type AuditEntity = 'timesheet' | 'invoice' | 'expense' | 'worker' | 'compliance' | 'payroll' | 'po'

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  entityName: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  notes?: string
  ipAddress?: string
}

interface AuditTrailViewerProps {
  entityId?: string
  entityType?: AuditEntity
}

export function AuditTrailViewer({ entityId, entityType }: AuditTrailViewerProps) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const [auditLogs = [], setAuditLogs] = useKV<AuditLogEntry[]>('audit-logs', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all')
  const [entityFilter, setEntityFilter] = useState<'all' | AuditEntity>('all')

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter
    const matchesEntityId = !entityId || log.entityId === entityId
    const matchesEntityType = !entityType || log.entity === entityType

    return matchesSearch && matchesAction && matchesEntity && matchesEntityId && matchesEntityType
  })

  const exportAuditLog = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Entity Name', 'Notes'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.userName,
        log.action,
        log.entity,
        log.entityName,
        log.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {!entityId && (
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('auditTrail.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('auditTrail.subtitle')}</p>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder={t('auditTrail.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={(v: any) => setActionFilter(v)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('auditTrail.allActions')}</SelectItem>
            <SelectItem value="create">{t('auditTrail.actions.create')}</SelectItem>
            <SelectItem value="update">{t('auditTrail.actions.update')}</SelectItem>
            <SelectItem value="delete">{t('auditTrail.actions.delete')}</SelectItem>
            <SelectItem value="approve">{t('auditTrail.actions.approve')}</SelectItem>
            <SelectItem value="reject">{t('auditTrail.actions.reject')}</SelectItem>
            <SelectItem value="adjust">{t('auditTrail.actions.adjust')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={(v: any) => setEntityFilter(v)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('auditTrail.allEntities')}</SelectItem>
            <SelectItem value="timesheet">{t('auditTrail.entities.timesheets')}</SelectItem>
            <SelectItem value="invoice">{t('auditTrail.entities.invoices')}</SelectItem>
            <SelectItem value="expense">{t('auditTrail.entities.expenses')}</SelectItem>
            <SelectItem value="worker">{t('auditTrail.entities.workers')}</SelectItem>
            <SelectItem value="compliance">{t('auditTrail.entities.compliance')}</SelectItem>
          </SelectContent>
        </Select>
        {hasPermission('reports.audit') && (
          <Button variant="outline" onClick={exportAuditLog}>
            <Download size={18} className="mr-2" />
            {t('auditTrail.export')}
          </Button>
        )}
      </div>

      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <ClockCounterClockwise size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('auditTrail.noLogsFound')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log, idx) => (
                  <AuditLogCard key={log.id} log={log} showDate={idx === 0 || new Date(log.timestamp).toDateString() !== new Date(filteredLogs[idx - 1].timestamp).toDateString()} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

interface AuditLogCardProps {
  log: AuditLogEntry
  showDate: boolean
}

function AuditLogCard({ log, showDate }: AuditLogCardProps) {
  const { t } = useTranslation()
  
  const actionConfig: Record<AuditAction, { color: string; label: string }> = {
    create: { color: 'bg-success/10 text-success border-success/20', label: t('auditTrail.actions.created') },
    update: { color: 'bg-info/10 text-info border-info/20', label: t('auditTrail.actions.updated') },
    delete: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: t('auditTrail.actions.deleted') },
    approve: { color: 'bg-success/10 text-success border-success/20', label: t('auditTrail.actions.approved') },
    reject: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: t('auditTrail.actions.rejected') },
    send: { color: 'bg-info/10 text-info border-info/20', label: t('auditTrail.actions.sent') },
    adjust: { color: 'bg-warning/10 text-warning border-warning/20', label: t('auditTrail.actions.adjusted') },
    import: { color: 'bg-accent/10 text-accent border-accent/20', label: t('auditTrail.actions.imported') }
  }

  const config = actionConfig[log.action]

  return (
    <div>
      {showDate && (
        <div className="mb-3 mt-6 first:mt-0">
          <p className="text-sm font-medium text-muted-foreground">
            {new Date(log.timestamp).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
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
                    <Badge variant="outline" className={cn('text-xs', config.color)}>
                      {config.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {log.entity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{log.entityName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                    {log.ipAddress && ` • ${log.ipAddress}`}
                  </p>
                </div>
              </div>

              {log.notes && (
                <p className="text-sm text-muted-foreground">{log.notes}</p>
              )}

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
                          <span className="line-through text-muted-foreground font-mono">
                            {String(change.oldValue)}
                          </span>
                          <span>→</span>
                          <span className="font-mono font-medium">
                            {String(change.newValue)}
                          </span>
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

export function addAuditLog(
  userId: string,
  userName: string,
  action: AuditAction,
  entity: AuditEntity,
  entityId: string,
  entityName: string,
  options?: {
    changes?: AuditLogEntry['changes']
    notes?: string
    ipAddress?: string
  }
) {
  const newLog: AuditLogEntry = {
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    entity,
    entityId,
    entityName,
    ...options
  }

  return newLog
}
