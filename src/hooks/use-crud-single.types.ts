import type { BaseEntity } from '@/lib/indexed-db'

export type SetEntities<T> = (updater: (prev: T[]) => T[]) => void

export interface CrudSingleRead<T extends BaseEntity> {
  read: (id: string) => Promise<T | undefined>
  readAll: () => Promise<T[]>
  readByIndex: (indexName: string, value: unknown) => Promise<T[]>
  query: (predicate: (entity: T) => boolean) => Promise<T[]>
}

export interface CrudSingleWrite<T extends BaseEntity> {
  create: (entity: Omit<T, 'id'>) => Promise<T>
  update: (id: string, updates: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
}
