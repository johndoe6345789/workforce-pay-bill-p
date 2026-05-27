// Barrel — assembles IndexedDBManager from sub-modules and re-exports all public symbols.
import { openDatabase } from './indexed-db.setup'
import {
  dbSaveSession, dbGetSession, dbGetCurrentSession,
  dbUpdateSessionActivity, dbDeleteSession, dbGetAllSessions, dbClearAllSessions,
} from './indexed-db.session'
import { dbSaveAppState, dbGetAppState, dbDeleteAppState, dbClearAppState } from './indexed-db.appstate'
import { dbCreate, dbRead, dbReadAll, dbReadByIndex, dbUpdate, dbDelete, dbDeleteAll } from './indexed-db.crud'
import { dbBulkCreate, dbBulkUpdate } from './indexed-db.bulk'
import type { SessionData, AppStateData, BaseEntity } from './indexed-db.types'
export type { SessionData, AppStateData, BaseEntity }
export { STORES } from './indexed-db.types'

class IndexedDBManager {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise
    this.initPromise = openDatabase().then(db => { this.db = db })
    return this.initPromise
  }

  private async ensureDb(): Promise<IDBDatabase> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    return this.db
  }

  async close(): Promise<void> {
    if (this.db) { this.db.close(); this.db = null; this.initPromise = null }
  }

  async saveSession(data: Omit<SessionData, 'id' | 'loginTimestamp' | 'lastActivityTimestamp'>): Promise<string> {
    return dbSaveSession(await this.ensureDb(), data)
  }
  async getSession(id: string): Promise<SessionData | null> {
    return dbGetSession(await this.ensureDb(), id, sid => this.deleteSession(sid))
  }
  async getCurrentSession(): Promise<SessionData | null> {
    return dbGetCurrentSession(await this.ensureDb(), id => this.deleteSession(id))
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    const s = await this.getSession(sessionId)
    if (s) return dbUpdateSessionActivity(await this.ensureDb(), s)
  }
  async deleteSession(sessionId: string): Promise<void> {
    return dbDeleteSession(await this.ensureDb(), sessionId)
  }
  async getAllSessions(): Promise<SessionData[]> {
    return dbGetAllSessions(await this.ensureDb(), id => this.deleteSession(id))
  }
  async clearAllSessions(): Promise<void> { return dbClearAllSessions(await this.ensureDb()) }

  async saveAppState<T>(key: string, value: T): Promise<void> {
    return dbSaveAppState(await this.ensureDb(), key, value)
  }
  async getAppState<T>(key: string): Promise<T | null> {
    return dbGetAppState<T>(await this.ensureDb(), key)
  }
  async deleteAppState(key: string): Promise<void> {
    return dbDeleteAppState(await this.ensureDb(), key)
  }
  async clearAppState(): Promise<void> { return dbClearAppState(await this.ensureDb()) }

  async create<T extends BaseEntity>(storeName: string, entity: T): Promise<T> {
    return dbCreate(await this.ensureDb(), storeName, entity)
  }
  async read<T extends BaseEntity>(storeName: string, id: string): Promise<T | null> {
    return dbRead<T>(await this.ensureDb(), storeName, id)
  }
  async readAll<T extends BaseEntity>(storeName: string): Promise<T[]> {
    return dbReadAll<T>(await this.ensureDb(), storeName)
  }
  async readByIndex<T extends BaseEntity>(
    storeName: string, indexName: string, value: IDBValidKey | IDBKeyRange
  ): Promise<T[]> {
    return dbReadByIndex<T>(await this.ensureDb(), storeName, indexName, value)
  }
  async update<T extends BaseEntity>(storeName: string, entity: T): Promise<T> {
    return dbUpdate(await this.ensureDb(), storeName, entity)
  }
  async delete(storeName: string, id: string): Promise<void> {
    return dbDelete(await this.ensureDb(), storeName, id)
  }
  async deleteAll(storeName: string): Promise<void> {
    return dbDeleteAll(await this.ensureDb(), storeName)
  }
  async bulkCreate<T extends BaseEntity>(storeName: string, entities: T[]): Promise<T[]> {
    return dbBulkCreate(await this.ensureDb(), storeName, entities)
  }
  async bulkUpdate<T extends BaseEntity>(storeName: string, entities: T[]): Promise<T[]> {
    return dbBulkUpdate(await this.ensureDb(), storeName, entities)
  }
  async query<T extends BaseEntity>(storeName: string, predicate: (entity: T) => boolean): Promise<T[]> {
    return (await this.readAll<T>(storeName)).filter(predicate)
  }
}
export const indexedDB = new IndexedDBManager()
