export declare class MediaCacheManager {
    private cache;
    private inflightPromises;
    private defaultTTLMs;
    constructor(defaultTTLMs?: number);
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttlMs?: number): void;
    getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T>;
    invalidate(key: string): void;
    clear(): void;
    size(): number;
}
//# sourceMappingURL=cache.d.ts.map