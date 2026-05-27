import { CheckCircle, Warning, XCircle, Download, CaretDown } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { ComplianceDetailDialog } from '@/components/ComplianceDetailDialog'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { ComplianceCard } from '@/components/compliance/ComplianceCard'
import { UploadDocumentDialog } from '@/components/compliance/UploadDocumentDialog'
import { useComplianceView } from '@/hooks/useComplianceView'
import type { ComplianceDocument } from '@/lib/types'

interface ComplianceViewProps {
  complianceDocs: ComplianceDocument[]
  onUploadDocument: (data: { workerId: string; workerName: string; documentType: string; expiryDate: string }) => void
}

const TAB_DEFS = [
  { value: 'expiring', filter: (d: ComplianceDocument) => d.status === 'expiring', hasEmpty: true },
  { value: 'expired', filter: (d: ComplianceDocument) => d.status === 'expired', hasEmpty: false },
  { value: 'valid', filter: (d: ComplianceDocument) => d.status === 'valid', hasEmpty: false },
  { value: 'all', filter: () => true, hasEmpty: false },
]

export function ComplianceView({ complianceDocs, onUploadDocument }: ComplianceViewProps) {
  const vm = useComplianceView({ complianceDocs, onUploadDocument })

  return (
    <Stack spacing={6}>
      <PageHeader
        title={vm.t('compliance.title')}
        description={vm.t('compliance.subtitle')}
        actions={
          <UploadDocumentDialog
            open={vm.isUploadOpen}
            onOpenChange={vm.setIsUploadOpen}
            form={vm.uploadForm}
            setForm={vm.setUploadForm}
            onSubmit={vm.handleSubmitUpload}
            t={vm.t}
          />
        }
      />

      <AdvancedSearch
        items={complianceDocs}
        fields={vm.complianceFields}
        onResultsChange={vm.handleResultsChange}
        placeholder={vm.t('compliance.searchPlaceholder')}
      />

      <Stack direction="horizontal" spacing={2} justify="end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download size={18} className="mr-2" />{vm.t('common.export')}<CaretDown size={16} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => vm.handleExport('csv')}>{vm.t('common.exportAs', { format: 'CSV' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => vm.handleExport('xlsx')}>{vm.t('common.exportAs', { format: 'Excel' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => vm.handleExport('json')}>{vm.t('common.exportAs', { format: 'JSON' })}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Stack>

      <Grid cols={3} gap={4}>
        <MetricCard label={vm.t('compliance.validDocuments')} value={vm.validDocs.length} description={vm.t('compliance.validDocumentsDescription')} icon={<CheckCircle size={24} className="text-success" />} />
        <MetricCard label={vm.t('compliance.expiringSoon')} value={vm.expiringDocs.length} description={vm.t('compliance.expiringSoonDescription')} icon={<Warning size={24} className="text-warning" />} />
        <MetricCard label={vm.t('compliance.expiredDocuments')} value={vm.expiredDocs.length} description={vm.t('compliance.expiredDocumentsDescription')} icon={<XCircle size={24} className="text-destructive" />} />
      </Grid>

      <Tabs defaultValue="expiring" className="space-y-4">
        <TabsList>
          {TAB_DEFS.map(({ value, filter }) => (
            <TabsTrigger key={value} value={value}>
              {vm.t(`compliance.tabs.${value}`)} ({vm.filteredDocs.filter(filter).length})
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_DEFS.map(({ value, filter, hasEmpty }) => {
          const docs = vm.filteredDocs.filter(filter)
          return (
            <TabsContent key={value} value={value} className="space-y-3">
              {docs.map(doc => <ComplianceCard key={doc.id} document={doc} onViewDetails={vm.setViewingDocument} />)}
              {hasEmpty && docs.length === 0 && (
                <Card className="p-12 text-center">
                  <CheckCircle size={48} className="mx-auto text-success mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{vm.t('compliance.emptyStates.allCurrent')}</h3>
                  <p className="text-muted-foreground">{vm.t('compliance.emptyStates.allCurrentDescription')}</p>
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      <ComplianceDetailDialog
        document={vm.viewingDocument}
        open={vm.viewingDocument !== null}
        onOpenChange={open => { if (!open) vm.setViewingDocument(null) }}
      />
    </Stack>
  )
}
