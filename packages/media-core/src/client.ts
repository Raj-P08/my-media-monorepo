import {
  MediaCoreConfig,
  PexelsPhotoSearchResponse,
  PexelsCuratedPhotosResponse,
  PexelsVideoSearchResponse,
  PexelsPopularVideosResponse,
  PexelsPhoto,
  PexelsVideo,
  PexelsErrorResponse,
  MediaEventPayload,
} from './types.js';
import { MediaEventEmitter } from './events.js';
import { MediaCacheManager } from './cache.js';

export class MediaCoreClient {
  private apiKey: string;
  private baseUrl: string;
  private eventEmitter: MediaEventEmitter;
  private cacheManager: MediaCacheManager;

  constructor(config: MediaCoreConfig) {
    if (!config.apiKey) {
      throw new Error('[MediaCoreClient] Initialization failed: apiKey is required.');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.pexels.com').replace(/\/+$/, '');
    this.eventEmitter = new MediaEventEmitter(config.enableConsoleLogger ?? false);
    this.cacheManager = new MediaCacheManager(config.cacheTTLMs ?? 5 * 60 * 1000);
  }

  public get events(): MediaEventEmitter {
    return this.eventEmitter;
  }

  public get cache(): MediaCacheManager {
    return this.cacheManager;
  }

  // --- Photo API ---

  public async searchPhotos(
    query: string,
    page = 1,
    perPage = 20
  ): Promise<PexelsPhotoSearchResponse> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { page, per_page: perPage, photos: [], total_results: 0 };
    }
    const cacheKey = `photos:search:${cleanQuery}:${page}:${perPage}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsPhotoSearchResponse>(
        `/v1/search?query=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`
      )
    );
  }

  public async getCuratedPhotos(
    page = 1,
    perPage = 20
  ): Promise<PexelsCuratedPhotosResponse> {
    const cacheKey = `photos:curated:${page}:${perPage}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsCuratedPhotosResponse>(
        `/v1/curated?page=${page}&per_page=${perPage}`
      )
    );
  }

  public async getPhotoById(id: number): Promise<PexelsPhoto> {
    const cacheKey = `photos:id:${id}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsPhoto>(`/v1/photos/${id}`)
    );
  }

  // --- Video API ---

  public async searchVideos(
    query: string,
    page = 1,
    perPage = 20
  ): Promise<PexelsVideoSearchResponse> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { page, per_page: perPage, videos: [], total_results: 0 };
    }
    const cacheKey = `videos:search:${cleanQuery}:${page}:${perPage}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsVideoSearchResponse>(
        `/videos/search?query=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`
      )
    );
  }

  public async getPopularVideos(
    page = 1,
    perPage = 20
  ): Promise<PexelsPopularVideosResponse> {
    const cacheKey = `videos:popular:${page}:${perPage}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsPopularVideosResponse>(
        `/videos/popular?page=${page}&per_page=${perPage}`
      )
    );
  }

  public async getVideoById(id: number): Promise<PexelsVideo> {
    const cacheKey = `videos:id:${id}`;
    return this.cacheManager.getOrFetch(cacheKey, () =>
      this.fetchEndpoint<PexelsVideo>(`/videos/videos/${id}`)
    );
  }

  // --- Event & Interaction Tracking ---

  public trackDownload(
    mediaId: number,
    mediaType: 'photo' | 'video',
    item?: PexelsPhoto | PexelsVideo,
    meta?: Record<string, unknown>
  ): void {
    const payload: MediaEventPayload = {
      type: 'download',
      mediaId,
      mediaType,
      item,
      timestamp: Date.now(),
      meta,
    };
    this.eventEmitter.emit(payload);
  }

  public trackView(
    mediaId: number,
    mediaType: 'photo' | 'video',
    item?: PexelsPhoto | PexelsVideo,
    meta?: Record<string, unknown>
  ): void {
    const payload: MediaEventPayload = {
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

  private async fetchEndpoint<T>(endpoint: string): Promise<T> {
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
        const errorData = (await response.json()) as PexelsErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback to HTTP status text
      }
      throw new Error(`[MediaCoreClient] Request failed (${url}): ${errorMessage}`);
    }

    return response.json() as Promise<T>;
  }
}
