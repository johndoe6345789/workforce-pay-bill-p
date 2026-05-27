import type { Worker } from '@/lib/types'

export type SetWorkers = (updater: (prev: Worker[]) => Worker[]) => void

export interface BulkWorkerUpdate {
  id: string
  updates: Partial<Worker>
}
