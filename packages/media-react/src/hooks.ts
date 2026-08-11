import { useState, useEffect, useCallback } from 'react';
import {
  PexelsPhoto,
  PexelsVideo,
  MediaEventType,
  MediaEventCallback,
} from '@my-media/core';
import { useMediaClient } from './MediaContext';

export interface UseMediaSearchOptions {
  type?: 'photo' | 'video';
  initialPage?: number;
  perPage?: number;
  enabled?: boolean;
}

export interface UseMediaSearchReturn<T extends PexelsPhoto | PexelsVideo> {
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export function useMediaSearch<T extends PexelsPhoto | PexelsVideo = PexelsPhoto>(
  query: string,
  options: UseMediaSearchOptions = {}
): UseMediaSearchReturn<T> {
  const { type = 'photo', initialPage = 1, perPage = 20, enabled = true } = options;
  const client = useMediaClient();

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Reset data on query or type change
  useEffect(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [query, type, initialPage]);

  const fetchData = useCallback(
    async (targetPage: number, append = false) => {
      if (!enabled || !query.trim()) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (type === 'photo') {
          const response = await client.searchPhotos(query, targetPage, perPage);
          const newItems = response.photos as unknown as T[];
          setData((prev) => (append ? [...prev, ...newItems] : newItems));
          setHasMore(newItems.length >= perPage);
        } else {
          const response = await client.searchVideos(query, targetPage, perPage);
          const newItems = response.videos as unknown as T[];
          setData((prev) => (append ? [...prev, ...newItems] : newItems));
          setHasMore(newItems.length >= perPage);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [client, query, type, perPage, enabled]
  );

  useEffect(() => {
    fetchData(page, page > initialPage);
  }, [fetchData, page, initialPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refetch = useCallback(() => {
    setPage(initialPage);
    fetchData(initialPage, false);
  }, [fetchData, initialPage]);

  return { data, loading, error, page, hasMore, loadMore, refetch };
}

export interface UseMediaCuratedOptions {
  type?: 'photo' | 'video';
  initialPage?: number;
  perPage?: number;
  enabled?: boolean;
}

export function useMediaCurated<T extends PexelsPhoto | PexelsVideo = PexelsPhoto>(
  options: UseMediaCuratedOptions = {}
): UseMediaSearchReturn<T> {
  const { type = 'photo', initialPage = 1, perPage = 20, enabled = true } = options;
  const client = useMediaClient();

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = useCallback(
    async (targetPage: number, append = false) => {
      if (!enabled) return;

      setLoading(true);
      setError(null);

      try {
        if (type === 'photo') {
          const response = await client.getCuratedPhotos(targetPage, perPage);
          const newItems = response.photos as unknown as T[];
          setData((prev) => (append ? [...prev, ...newItems] : newItems));
          setHasMore(newItems.length >= perPage);
        } else {
          const response = await client.getPopularVideos(targetPage, perPage);
          const newItems = response.videos as unknown as T[];
          setData((prev) => (append ? [...prev, ...newItems] : newItems));
          setHasMore(newItems.length >= perPage);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [client, type, perPage, enabled]
  );

  useEffect(() => {
    fetchData(page, page > initialPage);
  }, [fetchData, page, initialPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refetch = useCallback(() => {
    setPage(initialPage);
    fetchData(initialPage, false);
  }, [fetchData, initialPage]);

  return { data, loading, error, page, hasMore, loadMore, refetch };
}

export function useMediaEvents(
  callback: MediaEventCallback,
  eventType?: MediaEventType
): void {
  const client = useMediaClient();

  useEffect(() => {
    if (!callback) return;

    if (eventType) {
      const unsubscribe = client.events.on(eventType, callback);
      return unsubscribe;
    } else {
      const unsubscribe = client.events.onAny(callback);
      return unsubscribe;
    }
  }, [client, callback, eventType]);
}
