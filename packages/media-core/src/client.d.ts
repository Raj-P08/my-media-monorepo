import { MediaCoreConfig, PexelsPhotoSearchResponse, PexelsCuratedPhotosResponse, PexelsVideoSearchResponse, PexelsPopularVideosResponse, PexelsPhoto, PexelsVideo } from './types.js';
import { MediaEventEmitter } from './events.js';
import { MediaCacheManager } from './cache.js';
export declare class MediaCoreClient {
    private apiKey;
    private baseUrl;
    private eventEmitter;
    private cacheManager;
    constructor(config: MediaCoreConfig);
    get events(): MediaEventEmitter;
    get cache(): MediaCacheManager;
    searchPhotos(query: string, page?: number, perPage?: number): Promise<PexelsPhotoSearchResponse>;
    getCuratedPhotos(page?: number, perPage?: number): Promise<PexelsCuratedPhotosResponse>;
    getPhotoById(id: number): Promise<PexelsPhoto>;
    searchVideos(query: string, page?: number, perPage?: number): Promise<PexelsVideoSearchResponse>;
    getPopularVideos(page?: number, perPage?: number): Promise<PexelsPopularVideosResponse>;
    getVideoById(id: number): Promise<PexelsVideo>;
    trackDownload(mediaId: number, mediaType: 'photo' | 'video', item?: PexelsPhoto | PexelsVideo, meta?: Record<string, unknown>): void;
    trackView(mediaId: number, mediaType: 'photo' | 'video', item?: PexelsPhoto | PexelsVideo, meta?: Record<string, unknown>): void;
    private fetchEndpoint;
}
//# sourceMappingURL=client.d.ts.map