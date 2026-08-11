/**
 * Framework-agnostic TypeScript types for @my-media/core
 */

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string | null;
  src: PexelsPhotoSrc;
  liked: boolean;
  alt: string;
}

export interface PexelsVideoFile {
  id: number;
  quality: 'hd' | 'sd' | 'hls' | string;
  file_type: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  link: string;
}

export interface PexelsVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

export interface PexelsPaginatedResponse {
  page: number;
  per_page: number;
  total_results?: number;
  next_page?: string;
  prev_page?: string;
}

export interface PexelsPhotoSearchResponse extends PexelsPaginatedResponse {
  photos: PexelsPhoto[];
}

export interface PexelsCuratedPhotosResponse extends PexelsPaginatedResponse {
  photos: PexelsPhoto[];
}

export interface PexelsVideoSearchResponse extends PexelsPaginatedResponse {
  videos: PexelsVideo[];
}

export interface PexelsPopularVideosResponse extends PexelsPaginatedResponse {
  videos: PexelsVideo[];
}

export interface PexelsErrorResponse {
  error: string;
  status?: number;
}

export interface MediaCoreConfig {
  apiKey: string;
  baseUrl?: string;
  cacheTTLMs?: number;
  enableConsoleLogger?: boolean;
}

export type MediaEventType = 'download' | 'view';

export interface MediaEventPayload {
  type: MediaEventType;
  mediaId: number;
  mediaType: 'photo' | 'video';
  item?: PexelsPhoto | PexelsVideo;
  timestamp: number;
  meta?: Record<string, unknown>;
}

export type MediaEventCallback = (payload: MediaEventPayload) => void;
export type UnsubscribeFunction = () => void;
