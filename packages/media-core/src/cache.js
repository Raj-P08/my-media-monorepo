export class MediaCacheManager {
    cache = new Map();
    inflightPromises = new Map();
    defaultTTLMs;
    constructor(defaultTTLMs = 5 * 60 * 1000) {
        this.defaultTTLMs = defaultTTLMs;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    set(key, data, ttlMs) {
        const ttl = ttlMs ?? this.defaultTTLMs;
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, { data, expiresAt });
    }
    async getOrFetch(key, fetcher, ttlMs) {
        // 1. Check valid cached data
        const cached = this.get(key);
        if (cached !== null) {
            return cached;
        }
        // 2. Check inflight promise (deduplication)
        if (this.inflightPromises.has(key)) {
            return this.inflightPromises.get(key);
        }
        // 3. Initiate new fetch request
        const promise = (async () => {
            try {
                const result = await fetcher();
                this.set(key, result, ttlMs);
                return result;
            }
            finally {
                this.inflightPromises.delete(key);
            }
        })();
        this.inflightPromises.set(key, promise);
        return promise;
    }
    invalidate(key) {
        this.cache.delete(key);
        this.inflightPromises.delete(key);
    }
    clear() {
        this.cache.clear();
        this.inflightPromises.clear();
    }
    size() {
        return this.cache.size;
    }
}
//# sourceMappingURL=cache.js.map