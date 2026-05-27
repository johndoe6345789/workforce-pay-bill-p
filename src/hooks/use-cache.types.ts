export interface CacheOptions<T> {
  ttl?: number
  maxSize?: number
  serialize?: (data: T) => string
  deserialize?: (data: string) => T
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
}
