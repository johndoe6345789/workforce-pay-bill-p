import { useCRUD } from './use-crud'
import { STORES } from '@/lib/indexed-db'
import type { PurchaseOrder } from '@/lib/types'

export function usePurchaseOrdersCRUD() {
  return useCRUD<PurchaseOrder>(STORES.PURCHASE_ORDERS)
}

export function usePurchaseOrdersCrud() {
  return usePurchaseOrdersCRUD()
}
