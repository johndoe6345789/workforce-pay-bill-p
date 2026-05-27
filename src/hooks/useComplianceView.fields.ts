import type { FilterField } from '@/components/AdvancedSearch'

type TFn = (key: string, params?: Record<string, unknown>) => string

export function buildComplianceFields(t: TFn): FilterField[] {
  return [
    { name: 'workerName', label: t('compliance.workerName'), type: 'text' },
    {
      name: 'documentType',
      label: t('compliance.documentType'),
      type: 'select',
      options: [
        { value: 'DBS Check', label: t('compliance.documentTypes.dbsCheck') },
        { value: 'Right to Work', label: t('compliance.documentTypes.rightToWork') },
        { value: 'Professional License', label: t('compliance.documentTypes.professionalLicense') },
        { value: 'First Aid Certificate', label: t('compliance.documentTypes.firstAidCertificate') },
        { value: 'Driving License', label: t('compliance.documentTypes.drivingLicense') },
        { value: 'Passport', label: t('compliance.documentTypes.passport') },
      ],
    },
    {
      name: 'status',
      label: t('common.status'),
      type: 'select',
      options: [
        { value: 'valid', label: t('compliance.status.valid') },
        { value: 'expiring', label: t('compliance.status.expiring') },
        { value: 'expired', label: t('compliance.status.expired') },
      ],
    },
    { name: 'daysUntilExpiry', label: t('compliance.daysUntilExpiry'), type: 'number' },
    { name: 'expiryDate', label: t('compliance.expiryDate'), type: 'date' },
  ]
}
