import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, FileText, FileArrowUp } from '@phosphor-icons/react'
import type { RefObject } from 'react'
import type { ImportType } from '@/data/batchImportConfig'
import { SAMPLE_CSV } from '@/data/batchImportConfig'

interface Props {
  type: ImportType
  csvData: string
  setCsvData: (v: string) => void
  skipFirstRow: boolean
  setSkipFirstRow: (v: boolean) => void
  isValidating: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  validateCsv: (data: string, type: ImportType) => void
  loadSample: (type: ImportType) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function CSVUploadForm({
  type, csvData, setCsvData, skipFirstRow, setSkipFirstRow,
  isValidating, fileInputRef, handleFileSelect, validateCsv, loadSample, t,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-accent transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${type}`}
        />
        <label htmlFor={`file-upload-${type}`} className="cursor-pointer flex flex-col items-center gap-2">
          <FileArrowUp size={32} className="text-muted-foreground" />
          <div>
            <p className="font-medium">{t('batchImport.clickToUpload')}</p>
            <p className="text-sm text-muted-foreground">{t('batchImport.dragAndDrop')}</p>
          </div>
        </label>
      </div>

      <Separator />

      <div>
        <Label>{t('batchImport.pasteCSVData')}</Label>
        <Textarea
          placeholder={t('batchImport.pasteCSVPlaceholder', { example: SAMPLE_CSV[type] })}
          value={csvData}
          onChange={e => setCsvData(e.target.value)}
          rows={10}
          className="font-mono text-xs mt-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="skip-header"
          checked={skipFirstRow}
          onCheckedChange={checked => setSkipFirstRow(checked as boolean)}
        />
        <Label htmlFor="skip-header" className="text-sm cursor-pointer">{t('batchImport.firstRowHeaders')}</Label>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => validateCsv(csvData, type)} disabled={!csvData.trim() || isValidating} className="flex-1">
          <CheckCircle size={18} className="mr-2" />
          {isValidating ? t('batchImport.validating') : t('batchImport.validateData')}
        </Button>
        <Button variant="outline" onClick={() => loadSample(type)}>
          <FileText size={18} className="mr-2" />{t('batchImport.loadSample')}
        </Button>
      </div>
    </div>
  )
}
