import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import type { InvoiceTemplate } from '@/lib/types'

const DEFAULT_FORM = { name: '', headerText: '', footerText: '', defaultPaymentTerms: 'Net 30', accentColor: '#3b82f6' }

const DEFAULT_TEMPLATES: InvoiceTemplate[] = [
  { id: 'standard', name: 'Standard Invoice', headerText: 'Thank you for your business', footerText: 'Payment is due within the specified terms. Late payments may incur additional charges.', defaultPaymentTerms: 'Net 30', accentColor: '#3b82f6' },
  { id: 'professional', name: 'Professional Services', headerText: 'Professional Services Rendered', footerText: 'All services provided in accordance with our master services agreement. Payment terms as agreed.', defaultPaymentTerms: 'Net 14', accentColor: '#8b5cf6' },
  { id: 'staffing', name: 'Staffing Agency', headerText: 'Temporary Staffing Services', footerText: 'Invoice covers temporary worker hours for the period specified. Please remit payment by due date.', defaultPaymentTerms: 'Net 7', accentColor: '#10b981' },
]

export type InvoiceFormData = typeof DEFAULT_FORM

export function useInvoiceTemplateManager() {
  const { t } = useTranslation()
  const [templates = [], setTemplates] = useKV<InvoiceTemplate[]>('invoice-templates', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<InvoiceTemplate | null>(null)
  const [formData, setFormData] = useState<InvoiceFormData>(DEFAULT_FORM)

  const resetForm = () => setFormData(DEFAULT_FORM)

  const initializeTemplates = () => {
    if (!templates.length) { setTemplates(DEFAULT_TEMPLATES); toast.success(t('invoiceTemplates.defaultsLoaded')) }
  }

  const handleCreate = () => {
    setTemplates(current => [...(current || []), { id: `template-${Date.now()}`, ...formData }])
    toast.success(t('invoiceTemplates.templateCreated'))
    setIsCreateOpen(false); resetForm()
  }

  const handleUpdate = () => {
    if (!editingTemplate) return
    setTemplates(current => (current || []).map(t => t.id === editingTemplate.id ? { ...t, ...formData } : t))
    toast.success(t('invoiceTemplates.templateUpdated'))
    setEditingTemplate(null); resetForm()
  }

  const handleDelete = (id: string) => {
    setTemplates(current => (current || []).filter(t => t.id !== id))
    toast.success(t('invoiceTemplates.templateDeleted'))
  }

  const openEditDialog = (template: InvoiceTemplate) => {
    setEditingTemplate(template)
    setFormData({ name: template.name, headerText: template.headerText, footerText: template.footerText, defaultPaymentTerms: template.defaultPaymentTerms, accentColor: template.accentColor })
  }

  return {
    t, templates,
    isCreateOpen, setIsCreateOpen,
    editingTemplate, setEditingTemplate,
    previewTemplate, setPreviewTemplate,
    formData, setFormData,
    resetForm, initializeTemplates, handleCreate, handleUpdate, handleDelete, openEditDialog,
  }
}
