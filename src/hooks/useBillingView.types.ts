import type { Invoice, RateCard } from '@/lib/types'
import type { FilterField } from '@/components/AdvancedSearch'
import type { TableColumn } from '@/hooks/use-advanced-table'

export interface UseBillingViewOptions {
  rateCards: RateCard[]
}

export interface InvoiceActionsResult {
  handleResultsChange: (results: Invoice[]) => void
  handleSendInvoice: (invoiceId: string) => Promise<void>
  handleCreatePlacementInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>
  handleCreateCreditNote: (
    creditNote: Omit<Invoice, 'id' | 'type' | 'relatedInvoiceId'>,
    creditInvoice: Invoice
  ) => Promise<void>
  handleDeleteInvoice: (invoiceId: string) => Promise<void>
}

export interface InvoiceColumnsResult {
  invoiceFields: FilterField[]
  invoiceColumns: TableColumn<Invoice>[]
}
