import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'

/** i18n key per entity name for label lookup. */
const ENTITY_KEYS: Record<string, string> = {
  'Main Agency': 'entities.mainAgency',
  'North Division': 'entities.northDivision',
  'South Division': 'entities.southDivision',
}

/**
 * Manages sidebar expand/collapse state, entity
 * translation, and user initials derivation.
 */
export function useSidebar(currentEntity: string) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(new Set(['core']))

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const entityLabel = ENTITY_KEYS[currentEntity]
    ? t(ENTITY_KEYS[currentEntity])
    : currentEntity

  const userInitials = user
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return {
    t, user, logout,
    expandedGroups, toggleGroup,
    entityLabel, userInitials,
  }
}
