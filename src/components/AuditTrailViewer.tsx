import { ClockCounterClockwise, MagnifyingGlass, Funnel, Download, FileText } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import { useAuditTrailViewer } from '@/hooks/useAuditTrailViewer'
import { AuditLogCard } from '@/components/audit-trail/AuditLogCard'

export type AuditAction = 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'send' | 'adjust' | 'import'
export type AuditEntity = 'timesheet' | 'invoice' | 'expense' | 'worker' | 'compliance' | 'payroll' | 'po'

export interface AuditLogEntry {
  id: string; timestamp: string; userId: string; userName: string
  action: AuditAction; entity: AuditEntity; entityId: string; entityName: string
  changes?: { field: string; oldValue: any; newValue: any }[]
  notes?: string; ipAddress?: string
}

interface Props { entityId?: string; entityType?: AuditEntity }

export function AuditTrailViewer({ entityId, entityType }: Props) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const vm = useAuditTrailViewer(entityId, entityType)

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
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('auditTrail.searchPlaceholder')} value={vm.searchQuery} onChange={e => vm.setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={vm.actionFilter} onValueChange={(v: any) => vm.setActionFilter(v)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2"><Funnel size={16} /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('auditTrail.allActions')}</SelectItem>
            {(['create', 'update', 'delete', 'approve', 'reject', 'adjust'] as AuditAction[]).map(a => (
              <SelectItem key={a} value={a}>{t(`auditTrail.actions.${a}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={vm.entityFilter} onValueChange={(v: any) => vm.setEntityFilter(v)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2"><FileText size={16} /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('auditTrail.allEntities')}</SelectItem>
            {(['timesheet', 'invoice', 'expense', 'worker', 'compliance'] as AuditEntity[]).map(e => (
              <SelectItem key={e} value={e}>{t(`auditTrail.entities.${e}s`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasPermission('reports.audit') && (
          <Button variant="outline" onClick={vm.exportAuditLog}>
            <Download size={18} className="mr-2" />{t('auditTrail.export')}
          </Button>
        )}
      </div>

      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-4">
            {vm.filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <ClockCounterClockwise size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('auditTrail.noLogsFound')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vm.filteredLogs.map((log, idx) => (
                  <AuditLogCard key={log.id} log={log} showDate={idx === 0 || new Date(log.timestamp).toDateString() !== new Date(vm.filteredLogs[idx - 1].timestamp).toDateString()} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

export function addAuditLog(userId: string, userName: string, action: AuditAction, entity: AuditEntity, entityId: string, entityName: string, options?: { changes?: AuditLogEntry['changes']; notes?: string; ipAddress?: string }): AuditLogEntry {
  return { id: `AUD-${Date.now()}`, timestamp: new Date().toISOString(), userId, userName, action, entity, entityId, entityName, ...options }
}
