import { useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export interface Template {
  id: string
  name: string
  description?: string
  category?: string
  content: any
  createdDate: string
  modifiedDate: string
}

export function useTemplateManager<T = any>(storageKey: string) {
  const [templates = [], setTemplates] = useKV<Template[]>(storageKey, [])

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
        return current.map((template) =>
          template.id === id
            ? {
                ...template,
                ...updates,
                modifiedDate: new Date().toISOString(),
              }
            : template
        )
      })
    },
    [setTemplates]
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates((current) => {
        if (!current) return []
        return current.filter((template) => template.id !== id)
      })
    },
    [setTemplates]
  )

  const getTemplate = useCallback(
    (id: string): Template | undefined => {
      return templates.find((template) => template.id === id)
    },
    [templates]
  )

  const getTemplatesByCategory = useCallback(
    (category: string): Template[] => {
      return templates.filter((template) => template.category === category)
    },
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

  return {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getTemplatesByCategory,
    duplicateTemplate,
    applyTemplate,
  }
}
