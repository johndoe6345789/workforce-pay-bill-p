import { useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export interface AuditEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
}

export function useAuditLog() {
  const [auditLog = [], setAuditLog] = useKV<AuditEntry[]>('audit-log', [])

  const logAction = useCallback(
    async (
      action: string,
      entityType: string,
      entityId: string,
      changes?: Record<string, { old: any; new: any }>,
      metadata?: Record<string, any>
    ) => {
      const user = await window.spark.user()
      if (!user) return
      
      const entry: AuditEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: String(user.id),
        userName: user.login,
        action,
        entityType,
        entityId,
        changes,
        metadata,
      }

      setAuditLog((current) => [entry, ...(current || [])])
    },
    [setAuditLog]
  )

  const getLogsByEntity = useCallback(
    (entityType: string, entityId: string) => {
      return auditLog.filter(
        (entry) => entry.entityType === entityType && entry.entityId === entityId
      )
    },
    [auditLog]
  )

  const getLogsByUser = useCallback(
    (userId: string) => {
      return auditLog.filter((entry) => entry.userId === userId)
    },
    [auditLog]
  )

  const getLogsByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return auditLog.filter((entry) => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= startDate && entryDate <= endDate
      })
    },
    [auditLog]
  )

  const clearLog = useCallback(() => {
    setAuditLog([])
  }, [setAuditLog])

  return {
    auditLog,
    logAction,
    getLogsByEntity,
    getLogsByUser,
    getLogsByDateRange,
    clearLog,
  }
}
