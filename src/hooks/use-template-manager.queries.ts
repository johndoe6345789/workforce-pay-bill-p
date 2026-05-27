import { useCallback } from 'react'
import type { Template } from './use-template-manager.types'

type SetTemplates = (updater: (current: Template[] | undefined) => Template[]) => void

export function useTemplateQueries<T>(
  templates: Template[],
  setTemplates: SetTemplates
) {
  const getTemplate = useCallback(
    (id: string): Template | undefined => templates.find((t) => t.id === id),
    [templates]
  )

  const getTemplatesByCategory = useCallback(
    (category: string): Template[] => templates.filter((t) => t.category === category),
    [templates]
  )

  const duplicateTemplate = useCallback(
    (id: string): Template | undefined => {
      const original = templates.find((t) => t.id === id)
      if (!original) return undefined
      const duplicate: Template = {
        ...original,
        id: `TPL-${Date.now()}`,
        name: `${original.name} (Copy)`,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
      }
      setTemplates((current) => [...(current || []), duplicate])
      return duplicate
    },
    [templates, setTemplates]
  )

  const applyTemplate = useCallback(
    (id: string): T | undefined => {
      const template = templates.find((t) => t.id === id)
      return template?.content as T | undefined
    },
    [templates]
  )

  return { getTemplate, getTemplatesByCategory, duplicateTemplate, applyTemplate }
}
