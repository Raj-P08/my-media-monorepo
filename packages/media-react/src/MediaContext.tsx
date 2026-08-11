import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { MediaCoreClient, MediaCoreConfig } from '@my-media/core';

export interface MediaProviderProps {
  apiKey?: string;
  config?: Omit<MediaCoreConfig, 'apiKey'>;
  client?: MediaCoreClient;
  children: ReactNode;
}

const MediaContext = createContext<MediaCoreClient | null>(null);

export const MediaProvider: React.FC<MediaProviderProps> = ({
  apiKey,
  config,
  client,
  children,
}) => {
  const mediaClient = useMemo(() => {
    if (client) return client;
    if (!apiKey) {
      throw new Error('[MediaProvider] Either an `apiKey` string or a `client` instance must be provided.');
    }
    return new MediaCoreClient({
      apiKey,
      ...config,
    });
  }, [apiKey, config, client]);

  return <MediaContext.Provider value={mediaClient}>{children}</MediaContext.Provider>;
};

export const useMediaClient = (): MediaCoreClient => {
  const client = useContext(MediaContext);
  if (!client) {
    throw new Error('[useMediaClient] Must be used within a <MediaProvider>.');
  }
  return client;
};
