import { useKV } from '@github/spark/hooks'
import type { Template } from './use-template-manager.types'
import { useTemplateMutations } from './use-template-manager.mutations'
import { useTemplateQueries } from './use-template-manager.queries'

export type { Template } from './use-template-manager.types'

export function useTemplateManager<T = unknown>(storageKey: string) {
  const [templates = [], setTemplates] = useKV<Template[]>(storageKey, [])

  const { createTemplate, updateTemplate, deleteTemplate } =
    useTemplateMutations<T>(setTemplates)

  const { getTemplate, getTemplatesByCategory, duplicateTemplate, applyTemplate } =
    useTemplateQueries<T>(templates, setTemplates)

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
