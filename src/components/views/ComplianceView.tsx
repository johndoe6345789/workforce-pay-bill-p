import { useState, useEffect, useCallback } from 'react'
import {
  UploadSimple,
  Warning,
  XCircle,
  CheckCircle,
  FileText
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { toast } from 'sonner'
import { ComplianceDetailDialog } from '@/components/ComplianceDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { cn } from '@/lib/utils'
import type { ComplianceDocument } from '@/lib/types'
import { useTranslation } from '@/hooks/use-translation'

interface ComplianceViewProps {
  complianceDocs: ComplianceDocument[]
  onUploadDocument: (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => void
}

export function ComplianceView({ complianceDocs, onUploadDocument }: ComplianceViewProps) {
  const { t } = useTranslation()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<ComplianceDocument | null>(null)
  const [filteredDocs, setFilteredDocs] = useState<ComplianceDocument[]>([])
  
  useEffect(() => {
    setFilteredDocs(complianceDocs)
  }, [complianceDocs])
  
  const handleResultsChange = useCallback((results: ComplianceDocument[]) => {
    setFilteredDocs(results)
  }, [])
  
  const expiringDocs = filteredDocs.filter(d => d.status === 'expiring')
  const expiredDocs = filteredDocs.filter(d => d.status === 'expired')
  const validDocs = filteredDocs.filter(d => d.status === 'valid')
  
  const [uploadFormData, setUploadFormData] = useState({
    workerId: '',
    workerName: '',
    documentType: '',
    expiryDate: ''
  })

  const complianceFields: FilterField[] = [
    { name: 'workerName', label: t('compliance.workerName'), type: 'text' },
    { name: 'documentType', label: t('compliance.documentType'), type: 'select', options: [
      { value: 'DBS Check', label: t('compliance.documentTypes.dbsCheck') },
      { value: 'Right to Work', label: t('compliance.documentTypes.rightToWork') },
      { value: 'Professional License', label: t('compliance.documentTypes.professionalLicense') },
      { value: 'First Aid Certificate', label: t('compliance.documentTypes.firstAidCertificate') },
      { value: 'Driving License', label: t('compliance.documentTypes.drivingLicense') },
      { value: 'Passport', label: t('compliance.documentTypes.passport') }
    ]},
    { name: 'status', label: t('common.status'), type: 'select', options: [
      { value: 'valid', label: t('compliance.status.valid') },
      { value: 'expiring', label: t('compliance.status.expiring') },
      { value: 'expired', label: t('compliance.status.expired') }
    ]},
    { name: 'daysUntilExpiry', label: t('compliance.daysUntilExpiry'), type: 'number' },
    { name: 'expiryDate', label: t('compliance.expiryDate'), type: 'date' }
  ]

  const handleSubmitUpload = () => {
    if (!uploadFormData.workerName || !uploadFormData.documentType || !uploadFormData.expiryDate) {
      toast.error(t('compliance.uploadDialog.fillAllFields'))
      return
    }

    onUploadDocument({
      workerId: uploadFormData.workerId || `W-${Date.now()}`,
      workerName: uploadFormData.workerName,
      documentType: uploadFormData.documentType,
      expiryDate: uploadFormData.expiryDate
    })

    setUploadFormData({
      workerId: '',
      workerName: '',
      documentType: '',
      expiryDate: ''
    })
    setIsUploadOpen(false)
  }

  return (
    <Stack spacing={6}>
      <PageHeader
        title={t('compliance.title')}
        description={t('compliance.subtitle')}
        actions={
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <UploadSimple size={18} className="mr-2" />
                {t('compliance.uploadDocument')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('compliance.uploadDialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('compliance.uploadDialog.description')}
                </DialogDescription>
              </DialogHeader>
              <Stack spacing={4} className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="workerName">{t('compliance.uploadDialog.workerNameLabel')}</Label>
                  <Input
                    id="workerName"
                    placeholder={t('compliance.uploadDialog.workerNamePlaceholder')}
                    value={uploadFormData.workerName}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, workerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentType">{t('compliance.uploadDialog.documentTypeLabel')}</Label>
                  <Select
                    value={uploadFormData.documentType}
                    onValueChange={(value) => setUploadFormData({ ...uploadFormData, documentType: value })}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder={t('compliance.uploadDialog.documentTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DBS Check">{t('compliance.documentTypes.dbsCheck')}</SelectItem>
                      <SelectItem value="Right to Work">{t('compliance.documentTypes.rightToWork')}</SelectItem>
                      <SelectItem value="Professional License">{t('compliance.documentTypes.professionalLicense')}</SelectItem>
                      <SelectItem value="First Aid Certificate">{t('compliance.documentTypes.firstAidCertificate')}</SelectItem>
                      <SelectItem value="Driving License">{t('compliance.documentTypes.drivingLicense')}</SelectItem>
                      <SelectItem value="Passport">{t('compliance.documentTypes.passport')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">{t('compliance.uploadDialog.expiryDateLabel')}</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={uploadFormData.expiryDate}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, expiryDate: e.target.value })}
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <UploadSimple size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">{t('compliance.uploadDialog.uploadAreaText')}</p>
                  <p className="text-xs text-muted-foreground">{t('compliance.uploadDialog.uploadAreaSubtext')}</p>
                </div>
              </Stack>
              <Stack direction="horizontal" spacing={2} justify="end">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>{t('compliance.uploadDialog.cancel')}</Button>
                <Button onClick={handleSubmitUpload}>{t('compliance.uploadDialog.upload')}</Button>
              </Stack>
            </DialogContent>
          </Dialog>
        }
      />

      <AdvancedSearch
        items={complianceDocs}
        fields={complianceFields}
        onResultsChange={handleResultsChange}
        placeholder={t('compliance.searchPlaceholder')}
      />

      <Grid cols={3} gap={4}>
        <MetricCard
          label={t('compliance.validDocuments')}
          value={validDocs.length}
          description={t('compliance.validDocumentsDescription')}
          icon={<CheckCircle size={24} className="text-success" />}
        />
        <MetricCard
          label={t('compliance.expiringSoon')}
          value={expiringDocs.length}
          description={t('compliance.expiringSoonDescription')}
          icon={<Warning size={24} className="text-warning" />}
        />
        <MetricCard
          label={t('compliance.expiredDocuments')}
          value={expiredDocs.length}
          description={t('compliance.expiredDocumentsDescription')}
          icon={<XCircle size={24} className="text-destructive" />}
        />
      </Grid>

      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiring">
            {t('compliance.tabs.expiring')} ({filteredDocs.filter(d => d.status === 'expiring').length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            {t('compliance.tabs.expired')} ({filteredDocs.filter(d => d.status === 'expired').length})
          </TabsTrigger>
          <TabsTrigger value="valid">
            {t('compliance.tabs.valid')} ({filteredDocs.filter(d => d.status === 'valid').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            {t('compliance.tabs.all')} ({filteredDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expiring" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'expiring').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
          {filteredDocs.filter(d => d.status === 'expiring').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('compliance.emptyStates.allCurrent')}</h3>
              <p className="text-muted-foreground">{t('compliance.emptyStates.allCurrentDescription')}</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'expired').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>

        <TabsContent value="valid" className="space-y-3">
          {filteredDocs.filter(d => d.status === 'valid').map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {filteredDocs.map(doc => (
            <ComplianceCard key={doc.id} document={doc} onViewDetails={setViewingDocument} />
          ))}
        </TabsContent>
      </Tabs>

      <ComplianceDetailDialog
        document={viewingDocument}
        open={viewingDocument !== null}
        onOpenChange={(open) => {
          if (!open) setViewingDocument(null)
        }}
      />
    </Stack>
  )
}

interface ComplianceCardProps {
  document: ComplianceDocument
  onViewDetails?: (document: ComplianceDocument) => void
}

function ComplianceCard({ document, onViewDetails }: ComplianceCardProps) {
  const { t } = useTranslation()
  const statusConfig = {
    valid: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    expiring: { icon: Warning, color: 'text-warning', bgColor: 'bg-warning/10' },
    expired: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  }

  const StatusIcon = statusConfig[document.status].icon

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails?.(document)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Stack spacing={3} className="flex-1">
            <Stack direction="horizontal" spacing={3} align="start">
              <div className={cn('p-2 rounded-lg', statusConfig[document.status].bgColor)}>
                <StatusIcon size={20} weight="fill" className={statusConfig[document.status].color} />
              </div>
              <div className="flex-1">
                <Stack direction="horizontal" spacing={3} align="center" className="mb-1">
                  <h3 className="font-semibold">{document.workerName}</h3>
                  <Badge variant={document.status === 'valid' ? 'success' : document.status === 'expiring' ? 'warning' : 'destructive'}>
                    {t(`compliance.status.${document.status}`)}
                  </Badge>
                </Stack>
                <Grid cols={3} gap={4} className="text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.documentType')}</p>
                    <p className="font-medium">{document.documentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.expiryDate')}</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('compliance.card.daysUntilExpiry')}</p>
                    <p className={cn(
                      'font-medium font-mono',
                      document.daysUntilExpiry < 0 ? 'text-destructive' : 
                      document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                    )}>
                      {document.daysUntilExpiry < 0 ? t('compliance.card.expired') : t('compliance.card.daysLabel', { days: document.daysUntilExpiry })}
                    </p>
                  </div>
                </Grid>
              </div>
            </Stack>
          </Stack>
          <Stack direction="horizontal" spacing={2} className="ml-4" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="outline">{t('compliance.card.view')}</Button>
            <Button size="sm">{t('compliance.card.uploadNew')}</Button>
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
