import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { SAMPLE_CSV } from '@/data/batchImportConfig'
import type { ImportType } from '@/data/batchImportConfig'
import type { ValidationResult, FieldMapping, ImportProgress } from './useBatchImport.types'
import { buildValidationResult } from './useBatchImport.utils'
import { useBatchImportExecutor } from './useBatchImportExecutor'

export type { ValidationResult, FieldMapping, ImportProgress }

export function useBatchImport(onImportComplete?: (data: Record<string, string>[]) => void) {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<ImportType>('timesheets')
  const [csvData, setCsvData] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showMapping, setShowMapping] = useState(false)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [skipFirstRow, setSkipFirstRow] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { handleImport } = useBatchImportExecutor({
    activeTab, csvData, fieldMappings, validationResult,
    setIsImporting, setImportProgress, onImportComplete,
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) { toast.error(t('batchImport.messages.selectCSV')); return }
    const reader = new FileReader()
    reader.onload = e => { setCsvData(e.target?.result as string); toast.success(t('batchImport.messages.fileLoaded')) }
    reader.onerror = () => toast.error(t('batchImport.messages.fileError'))
    reader.readAsText(file)
  }

  const validateCsv = (data: string, type: ImportType) => {
    setIsValidating(true)
    setTimeout(() => {
      const result = buildValidationResult(data, type, setFieldMappings)
      setValidationResult(result)
      setIsValidating(false)
    }, 500)
  }

  const resetImport = () => {
    setCsvData('')
    setValidationResult(null)
    setFieldMappings([])
    setImportProgress(null)
    setShowMapping(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadSample = (type: ImportType) => {
    setCsvData(SAMPLE_CSV[type])
    toast.info(t('batchImport.messages.sampleLoaded'))
  }

  return {
    t, activeTab, setActiveTab,
    csvData, setCsvData,
    validationResult,
    isValidating,
    showMapping, setShowMapping,
    fieldMappings, setFieldMappings,
    importProgress,
    isImporting,
    skipFirstRow, setSkipFirstRow,
    fileInputRef,
    validateCsv, handleImport, resetImport, loadSample, handleFileSelect,
  }
}
