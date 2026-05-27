import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload } from '@phosphor-icons/react'
import { PageHeader } from '@/components/ui/page-header'
import { PermissionGate } from '@/components/PermissionGate'
import { useBatchImport } from '@/hooks/useBatchImport'
import { ValidationResultsCard } from '@/components/batch-import/ValidationResultsCard'
import { FieldMappingCard } from '@/components/batch-import/FieldMappingCard'
import { ImportProgressCard } from '@/components/batch-import/ImportProgressCard'
import { FormatGuidelinesPanel } from '@/components/batch-import/FormatGuidelinesPanel'
import { CSVUploadForm } from '@/components/batch-import/CSVUploadForm'
import type { ImportType } from '@/data/batchImportConfig'

interface BatchImportManagerProps {
  onImportComplete?: (data: any[]) => void
}

const IMPORT_TYPES: ImportType[] = ['timesheets', 'expenses', 'workers']

export function BatchImportManager({ onImportComplete }: BatchImportManagerProps) {
  const vm = useBatchImport(onImportComplete)

  return (
    <PermissionGate permissions={['timesheets.create', 'expenses.create', 'workers.create']}>
      <div className="space-y-6">
        <PageHeader title={vm.t('batchImport.title')} description={vm.t('batchImport.subtitle')} />

        <Tabs value={vm.activeTab} onValueChange={v => vm.setActiveTab(v as ImportType)}>
          <TabsList>
            {IMPORT_TYPES.map(type => (
              <TabsTrigger key={type} value={type}>{vm.t(`batchImport.tabs.${type}`)}</TabsTrigger>
            ))}
          </TabsList>

          {IMPORT_TYPES.map(type => (
            <TabsContent key={type} value={type} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload size={20} />
                        {vm.t('batchImport.uploadData')}
                      </CardTitle>
                      <CardDescription>{vm.t('batchImport.uploadDataDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CSVUploadForm
                        type={type}
                        csvData={vm.csvData}
                        setCsvData={vm.setCsvData}
                        skipFirstRow={vm.skipFirstRow}
                        setSkipFirstRow={vm.setSkipFirstRow}
                        isValidating={vm.isValidating}
                        fileInputRef={vm.fileInputRef}
                        handleFileSelect={vm.handleFileSelect}
                        validateCsv={vm.validateCsv}
                        loadSample={vm.loadSample}
                        t={vm.t}
                      />
                      {vm.validationResult && (
                        <ValidationResultsCard
                          result={vm.validationResult}
                          showMapping={vm.showMapping}
                          isImporting={vm.isImporting}
                          onConfigureMapping={() => vm.setShowMapping(true)}
                          onImport={vm.handleImport}
                          onReset={vm.resetImport}
                        />
                      )}
                      {vm.importProgress && <ImportProgressCard progress={vm.importProgress} />}
                    </CardContent>
                  </Card>

                  {vm.showMapping && vm.fieldMappings.length > 0 && (
                    <FieldMappingCard fieldMappings={vm.fieldMappings} setFieldMappings={vm.setFieldMappings} />
                  )}
                </div>

                <FormatGuidelinesPanel type={type} validationResult={vm.validationResult} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PermissionGate>
  )
}
