import type { ComplianceDocument } from '@/lib/types'

export const TAB_DEFS = [
  { value: 'expiring', filter: (d: ComplianceDocument) => d.status === 'expiring', hasEmpty: true },
  { value: 'expired',  filter: (d: ComplianceDocument) => d.status === 'expired',  hasEmpty: false },
  { value: 'valid',    filter: (d: ComplianceDocument) => d.status === 'valid',    hasEmpty: false },
  { value: 'all',      filter: () => true,                                          hasEmpty: false },
]
