import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { AuditLogEntry } from '@/components/AuditTrailViewer'

type AuditAction = AuditLogEntry['action']
type AuditEntity = AuditLogEntry['entity']

export function useAuditTrailViewer(entityId?: string, entityType?: AuditEntity) {
  const [auditLogs = []] = useKV<AuditLogEntry[]>('audit-logs', [])
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
      ...filteredLogs.map(log => [new Date(log.timestamp).toISOString(), log.userName, log.action, log.entity, log.entityName, log.notes || ''])
    ].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { filteredLogs, searchQuery, setSearchQuery, actionFilter, setActionFilter, entityFilter, setEntityFilter, exportAuditLog }
}
