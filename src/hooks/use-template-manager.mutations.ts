import { useCallback } from 'react'
import type { Template } from './use-template-manager.types'

type SetTemplates = (updater: (current: Template[] | undefined) => Template[]) => void

export function useTemplateMutations<T>(setTemplates: SetTemplates) {
  const createTemplate = useCallback(
    (name: string, content: T, description?: string, category?: string): Template => {
      const template: Template = {
        id: `TPL-${Date.now()}`,
        name,
        description,
        category,
        content,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
      }
      setTemplates((current) => [...(current || []), template])
      return template
    },
    [setTemplates]
  )

  const updateTemplate = useCallback(
    (id: string, updates: Partial<Omit<Template, 'id' | 'createdDate'>>) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((t) =>
          t.id === id ? { ...t, ...updates, modifiedDate: new Date().toISOString() } : t
        )
      })
    },
    [setTemplates]
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates((current) => {
        if (!current) return []
        return current.filter((t) => t.id !== id)
      })
    },
    [setTemplates]
  )

  return { createTemplate, updateTemplate, deleteTemplate }
}
