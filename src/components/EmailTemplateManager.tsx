import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Envelope, Plus, Pencil, Trash, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { EmailTemplate, NotificationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export function EmailTemplateManager() {
  const { t } = useTranslation()
  const [templates = [], setTemplates] = useKV<EmailTemplate[]>('email-templates', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'timesheet' as NotificationType,
    subject: '',
    body: '',
    variables: [] as string[]
  })

  const defaultTemplates: EmailTemplate[] = [
    {
      id: 'timesheet-approval',
      name: 'Timesheet Approval Notification',
      type: 'timesheet',
      subject: 'Timesheet Approved - {{workerName}} - Week Ending {{weekEnding}}',
      body: 'Dear {{workerName}},\n\nYour timesheet for the week ending {{weekEnding}} has been approved.\n\nHours: {{hours}}\nAmount: {{amount}}\nClient: {{clientName}}\n\nBest regards,\nWorkForce Pro Team',
      variables: ['workerName', 'weekEnding', 'hours', 'amount', 'clientName']
    },
    {
      id: 'timesheet-rejection',
      name: 'Timesheet Rejection Notification',
      type: 'timesheet',
      subject: 'Timesheet Rejected - {{workerName}} - Week Ending {{weekEnding}}',
      body: 'Dear {{workerName}},\n\nYour timesheet for the week ending {{weekEnding}} has been rejected.\n\nReason: {{reason}}\n\nPlease review and resubmit with corrections.\n\nBest regards,\nWorkForce Pro Team',
      variables: ['workerName', 'weekEnding', 'reason']
    },
    {
      id: 'invoice-sent',
      name: 'Invoice Sent to Client',
      type: 'invoice',
      subject: 'Invoice {{invoiceNumber}} - {{clientName}}',
      body: 'Dear {{clientName}},\n\nPlease find attached invoice {{invoiceNumber}} dated {{issueDate}}.\n\nAmount Due: {{amount}} {{currency}}\nDue Date: {{dueDate}}\n\nPayment terms: {{paymentTerms}}\n\nThank you for your business.\n\nBest regards,\nWorkForce Pro',
      variables: ['invoiceNumber', 'clientName', 'issueDate', 'amount', 'currency', 'dueDate', 'paymentTerms']
    },
    {
      id: 'compliance-expiring',
      name: 'Document Expiring Alert',
      type: 'compliance',
      subject: 'Urgent: {{documentType}} Expiring Soon - {{workerName}}',
      body: 'Dear {{workerName}},\n\nYour {{documentType}} is expiring in {{daysUntilExpiry}} days on {{expiryDate}}.\n\nPlease upload an updated document as soon as possible to avoid any disruption to your assignments.\n\nUpload here: {{uploadLink}}\n\nBest regards,\nCompliance Team',
      variables: ['workerName', 'documentType', 'daysUntilExpiry', 'expiryDate', 'uploadLink']
    }
  ]

  const initializeTemplates = () => {
    if (templates.length === 0) {
      setTemplates(defaultTemplates)
      toast.success(t('emailTemplates.defaultsLoaded'))
    }
  }

  const handleCreateTemplate = () => {
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

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return

    setTemplates(current =>
      (current || []).map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              name: formData.name,
              type: formData.type,
              subject: formData.subject,
              body: formData.body,
              variables: extractVariables(formData.subject + ' ' + formData.body)
            }
          : t
      )
    )
    toast.success(t('emailTemplates.templateUpdated'))
    setEditingTemplate(null)
    resetForm()
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(current => (current || []).filter(t => t.id !== id))
    toast.success(t('emailTemplates.templateDeleted'))
  }

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g
    const matches = text.match(regex)
    if (!matches) return []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'timesheet',
      subject: '',
      body: '',
      variables: []
    })
  }

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      variables: template.variables
    })
  }

  const typeColors: Record<NotificationType, string> = {
    timesheet: 'bg-accent/10 text-accent',
    invoice: 'bg-info/10 text-info',
    compliance: 'bg-warning/10 text-warning',
    expense: 'bg-success/10 text-success',
    payroll: 'bg-primary/10 text-primary',
    system: 'bg-muted text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('emailTemplates.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('emailTemplates.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {templates.length === 0 && (
            <Button variant="outline" onClick={initializeTemplates}>
              {t('emailTemplates.loadDefaults')}
            </Button>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                {t('emailTemplates.createTemplate')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('emailTemplates.createTemplate')}</DialogTitle>
                <DialogDescription>
                  {t('emailTemplates.subtitle')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">{t('emailTemplates.templateName')}</Label>
                  <Input
                    id="template-name"
                    placeholder={t('emailTemplates.templateNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">{t('emailTemplates.templateType')}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as NotificationType })}
                  >
                    <SelectTrigger id="template-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timesheet">Timesheet</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="payroll">Payroll</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input
                    id="template-subject"
                    placeholder="Use {{variableName}} for dynamic content"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-body">Email Body</Label>
                  <Textarea
                    id="template-body"
                    placeholder="Use {{variableName}} for dynamic content"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Detected variables: {extractVariables(formData.subject + ' ' + formData.body).join(', ') || 'None'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm() }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={!formData.name || !formData.subject || !formData.body}>
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <Envelope size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No email templates</h3>
          <p className="text-muted-foreground mb-4">Create templates or load defaults to get started</p>
          <Button onClick={initializeTemplates}>Load Default Templates</Button>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="timesheet">Timesheet ({templates.filter(t => t.type === 'timesheet').length})</TabsTrigger>
            <TabsTrigger value="invoice">Invoice ({templates.filter(t => t.type === 'invoice').length})</TabsTrigger>
            <TabsTrigger value="compliance">Compliance ({templates.filter(t => t.type === 'compliance').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                typeColors={typeColors}
                onEdit={openEditDialog}
                onDelete={handleDeleteTemplate}
                onPreview={setPreviewTemplate}
              />
            ))}
          </TabsContent>

          <TabsContent value="timesheet" className="space-y-3 mt-4">
            {templates.filter(t => t.type === 'timesheet').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                typeColors={typeColors}
                onEdit={openEditDialog}
                onDelete={handleDeleteTemplate}
                onPreview={setPreviewTemplate}
              />
            ))}
          </TabsContent>

          <TabsContent value="invoice" className="space-y-3 mt-4">
            {templates.filter(t => t.type === 'invoice').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                typeColors={typeColors}
                onEdit={openEditDialog}
                onDelete={handleDeleteTemplate}
                onPreview={setPreviewTemplate}
              />
            ))}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-3 mt-4">
            {templates.filter(t => t.type === 'compliance').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                typeColors={typeColors}
                onEdit={openEditDialog}
                onDelete={handleDeleteTemplate}
                onPreview={setPreviewTemplate}
              />
            ))}
          </TabsContent>
        </Tabs>
      )}

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={(open) => { if (!open) { setEditingTemplate(null); resetForm() } }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
              <DialogDescription>
                Update the email notification template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name</Label>
                <Input
                  id="edit-template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-type">Notification Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as NotificationType })}
                >
                  <SelectTrigger id="edit-template-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timesheet">Timesheet</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="payroll">Payroll</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-subject">Email Subject</Label>
                <Input
                  id="edit-template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-body">Email Body</Label>
                <Textarea
                  id="edit-template-body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Detected variables: {extractVariables(formData.subject + ' ' + formData.body).join(', ') || 'None'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditingTemplate(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTemplate}>
                Update Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={(open) => { if (!open) setPreviewTemplate(null) }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
              <DialogDescription>
                Preview how this email will appear
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Subject</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                  {previewTemplate.subject}
                </div>
              </div>
              <div>
                <Label>Body</Label>
                <div className="mt-1 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                  {previewTemplate.body}
                </div>
              </div>
              <div>
                <Label>Variables</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {previewTemplate.variables.map(v => (
                    <Badge key={v} variant="outline" className="font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setPreviewTemplate(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: EmailTemplate
  typeColors: Record<NotificationType, string>
  onEdit: (template: EmailTemplate) => void
  onDelete: (id: string) => void
  onPreview: (template: EmailTemplate) => void
}

function TemplateCard({ template, typeColors, onEdit, onDelete, onPreview }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Envelope size={20} className="text-primary" />
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <Badge className={cn('text-xs', typeColors[template.type])}>
                {template.type}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Subject:</p>
                <p className="font-medium truncate">{template.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Variables:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map(v => (
                    <Badge key={v} variant="outline" className="text-xs font-mono">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onPreview(template)}>
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(template)}>
              <Pencil size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(template.id)}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
