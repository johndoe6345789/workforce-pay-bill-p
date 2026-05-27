import { useTranslation } from '@/hooks/use-translation'
import { useEmailTemplateCrud } from './useEmailTemplateCrud'

// Re-export public API that consumers may import from this file
export { TYPE_COLORS, extractVariables } from './useEmailTemplateManager.types'
export type { EmailFormData } from './useEmailTemplateManager.types'

export function useEmailTemplateManager() {
  const { t } = useTranslation()
  const crud = useEmailTemplateCrud()

  return {
    t,
    templates: crud.templates,
    isCreateOpen: crud.isCreateOpen,
    setIsCreateOpen: crud.setIsCreateOpen,
    editingTemplate: crud.editingTemplate,
    setEditingTemplate: crud.setEditingTemplate,
    previewTemplate: crud.previewTemplate,
    setPreviewTemplate: crud.setPreviewTemplate,
    formData: crud.formData,
    setFormData: crud.setFormData,
    resetForm: crud.resetForm,
    initializeTemplates: () => crud.initializeTemplates(t),
    handleCreate: () => crud.handleCreate(t),
    handleUpdate: () => crud.handleUpdate(t),
    handleDelete: (id: string) => crud.handleDelete(id, t),
    openEditDialog: crud.openEditDialog,
  }
}
