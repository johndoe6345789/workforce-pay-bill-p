import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import {
  DEFAULT_TEMPLATES,
  DEFAULT_FORM,
  extractVariables,
} from './useEmailTemplateManager.types'
import type { EmailTemplate, EmailFormData } from './useEmailTemplateManager.types'

interface EmailTemplateCrudResult {
  templates: EmailTemplate[]
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  editingTemplate: EmailTemplate | null
  setEditingTemplate: (t: EmailTemplate | null) => void
  previewTemplate: EmailTemplate | null
  setPreviewTemplate: (t: EmailTemplate | null) => void
  formData: EmailFormData
  setFormData: React.Dispatch<React.SetStateAction<EmailFormData>>
  resetForm: () => void
  initializeTemplates: (t: (key: string) => string) => void
  handleCreate: (t: (key: string) => string) => void
  handleUpdate: (t: (key: string) => string) => void
  handleDelete: (id: string, t: (key: string) => string) => void
  openEditDialog: (template: EmailTemplate) => void
}

export function useEmailTemplateCrud(): EmailTemplateCrudResult {
  const [templates = [], setTemplates] = useKV<EmailTemplate[]>('email-templates', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState<EmailFormData>(DEFAULT_FORM)

  const resetForm = () => setFormData(DEFAULT_FORM)

  const initializeTemplates = (t: (key: string) => string) => {
    if (!templates.length) {
      setTemplates(DEFAULT_TEMPLATES)
      toast.success(t('emailTemplates.defaultsLoaded'))
    }
  }

  const handleCreate = (t: (key: string) => string) => {
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      subject: formData.subject,
      body: formData.body,
      variables: extractVariables(formData.subject + ' ' + formData.body)
    }
    setTemplates(current => [...(current || []), newTemplate])
    toast.success(t('emailTemplates.templateCreated'))
    setIsCreateOpen(false)
    resetForm()
  }

  const handleUpdate = (t: (key: string) => string) => {
    if (!editingTemplate) return
    setTemplates(current =>
      (current || []).map(tmpl =>
        tmpl.id === editingTemplate.id
          ? { ...tmpl, name: formData.name, type: formData.type, subject: formData.subject, body: formData.body, variables: extractVariables(formData.subject + ' ' + formData.body) }
          : tmpl
      )
    )
    toast.success(t('emailTemplates.templateUpdated'))
    setEditingTemplate(null)
    resetForm()
  }

  const handleDelete = (id: string, t: (key: string) => string) => {
    setTemplates(current => (current || []).filter(tmpl => tmpl.id !== id))
    toast.success(t('emailTemplates.templateDeleted'))
  }

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData({ name: template.name, type: template.type, subject: template.subject, body: template.body, variables: template.variables })
  }

  return {
    templates,
    isCreateOpen, setIsCreateOpen,
    editingTemplate, setEditingTemplate,
    previewTemplate, setPreviewTemplate,
    formData, setFormData,
    resetForm, initializeTemplates, handleCreate, handleUpdate, handleDelete, openEditDialog,
  }
}
