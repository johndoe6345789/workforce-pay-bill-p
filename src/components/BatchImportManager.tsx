import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Upload, FileText, FileArrowUp } from '@phosphor-icons/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/ui/page-header'
import { PermissionGate } from '@/components/PermissionGate'
import { useBatchImport } from '@/hooks/useBatchImport'
import { ValidationResultsCard } from '@/components/batch-import/ValidationResultsCard'
import { FieldMappingCard } from '@/components/batch-import/FieldMappingCard'
import { ImportProgressCard } from '@/components/batch-import/ImportProgressCard'
import { FormatGuidelinesPanel } from '@/components/batch-import/FormatGuidelinesPanel'
import { SAMPLE_CSV } from '@/data/batchImportConfig'
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
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-accent transition-colors">
                          <input
                            ref={vm.fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={vm.handleFileSelect}
                            className="hidden"
                            id={`file-upload-${type}`}
                          />
                          <label htmlFor={`file-upload-${type}`} className="cursor-pointer flex flex-col items-center gap-2">
                            <FileArrowUp size={32} className="text-muted-foreground" />
                            <div>
                              <p className="font-medium">{vm.t('batchImport.clickToUpload')}</p>
                              <p className="text-sm text-muted-foreground">{vm.t('batchImport.dragAndDrop')}</p>
                            </div>
                          </label>
                        </div>

                        <Separator />

                        <div>
                          <Label>{vm.t('batchImport.pasteCSVData')}</Label>
                          <Textarea
                            placeholder={vm.t('batchImport.pasteCSVPlaceholder', { example: SAMPLE_CSV[type] })}
                            value={vm.csvData}
                            onChange={e => vm.setCsvData(e.target.value)}
                            rows={10}
                            className="font-mono text-xs mt-2"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="skip-header"
                            checked={vm.skipFirstRow}
                            onCheckedChange={checked => vm.setSkipFirstRow(checked as boolean)}
                          />
                          <Label htmlFor="skip-header" className="text-sm cursor-pointer">
                            {vm.t('batchImport.firstRowHeaders')}
                          </Label>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => vm.validateCsv(vm.csvData, type)}
                            disabled={!vm.csvData.trim() || vm.isValidating}
                            className="flex-1"
                          >
                            <CheckCircle size={18} className="mr-2" />
                            {vm.isValidating ? vm.t('batchImport.validating') : vm.t('batchImport.validateData')}
                          </Button>
                          <Button variant="outline" onClick={() => vm.loadSample(type)}>
                            <FileText size={18} className="mr-2" />
                            {vm.t('batchImport.loadSample')}
                          </Button>
                        </div>

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
                      </div>
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
