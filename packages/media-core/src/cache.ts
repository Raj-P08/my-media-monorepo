interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MediaCacheManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private inflightPromises: Map<string, Promise<unknown>> = new Map();
  private defaultTTLMs: number;

  constructor(defaultTTLMs = 5 * 60 * 1000) {
    this.defaultTTLMs = defaultTTLMs;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTTLMs;
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }

  public async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    // 1. Check valid cached data
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 2. Check inflight promise (deduplication)
    if (this.inflightPromises.has(key)) {
      return this.inflightPromises.get(key) as Promise<T>;
    }

    // 3. Initiate new fetch request
    const promise = (async () => {
      try {
        const result = await fetcher();
        this.set(key, result, ttlMs);
        return result;
      } finally {
        this.inflightPromises.delete(key);
      }
    })();

    this.inflightPromises.set(key, promise);
    return promise;
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
    this.inflightPromises.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.inflightPromises.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}
