import { MediaEventEmitter } from './events.js';
import { MediaCacheManager } from './cache.js';
export class MediaCoreClient {
    apiKey;
    baseUrl;
    eventEmitter;
    cacheManager;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('[MediaCoreClient] Initialization failed: apiKey is required.');
        }
        this.apiKey = config.apiKey;
        this.baseUrl = (config.baseUrl || 'https://api.pexels.com').replace(/\/+$/, '');
        this.eventEmitter = new MediaEventEmitter(config.enableConsoleLogger ?? false);
        this.cacheManager = new MediaCacheManager(config.cacheTTLMs ?? 5 * 60 * 1000);
    }
    get events() {
        return this.eventEmitter;
    }
    get cache() {
        return this.cacheManager;
    }
    // --- Photo API ---
    async searchPhotos(query, page = 1, perPage = 20) {
        const cleanQuery = query.trim();
        if (!cleanQuery) {
            return { page, per_page: perPage, photos: [], total_results: 0 };
        }
        const cacheKey = `photos:search:${cleanQuery}:${page}:${perPage}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/v1/search?query=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`));
    }
    async getCuratedPhotos(page = 1, perPage = 20) {
        const cacheKey = `photos:curated:${page}:${perPage}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/v1/curated?page=${page}&per_page=${perPage}`));
    }
    async getPhotoById(id) {
        const cacheKey = `photos:id:${id}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/v1/photos/${id}`));
    }
    // --- Video API ---
    async searchVideos(query, page = 1, perPage = 20) {
        const cleanQuery = query.trim();
        if (!cleanQuery) {
            return { page, per_page: perPage, videos: [], total_results: 0 };
        }
        const cacheKey = `videos:search:${cleanQuery}:${page}:${perPage}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/videos/search?query=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`));
    }
    async getPopularVideos(page = 1, perPage = 20) {
        const cacheKey = `videos:popular:${page}:${perPage}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/videos/popular?page=${page}&per_page=${perPage}`));
    }
    async getVideoById(id) {
        const cacheKey = `videos:id:${id}`;
        return this.cacheManager.getOrFetch(cacheKey, () => this.fetchEndpoint(`/videos/videos/${id}`));
    }
    // --- Event & Interaction Tracking ---
    trackDownload(mediaId, mediaType, item, meta) {
        const payload = {
            type: 'download',
            mediaId,
            mediaType,
            item,
            timestamp: Date.now(),
            meta,
        };
        this.eventEmitter.emit(payload);
    }
    trackView(mediaId, mediaType, item, meta) {
        const payload = {
            type: 'view',
            mediaId,
            mediaType,
            item,
            timestamp: Date.now(),
            meta,
        };
        this.eventEmitter.emit(payload);
    }
    // --- Internal Helper ---
    async fetchEndpoint(endpoint) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: this.apiKey,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = (await response.json());
                if (errorData?.error) {
                    errorMessage = errorData.error;
                }
            }
            catch {
                // Fallback to HTTP status text
            }
            throw new Error(`[MediaCoreClient] Request failed (${url}): ${errorMessage}`);
        }
        return response.json();
    }
}
//# sourceMappingURL=client.js.map