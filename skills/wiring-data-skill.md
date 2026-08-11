---
name: wiring-data-skill
description: Comprehensive AI Agent guide for initializing MediaProvider, handling Pexels API auth, invoking useMediaSearch and useMediaCurated hooks, and listening to download/view telemetry events.
---

# AI Skill: Wiring Data with @my-media/react and @my-media/core

This guide instructs AI assistants on how to connect data, handle authentication, invoke hooks, and capture telemetry events using the `@my-media/react` platform wrapper and `@my-media/core` engine.

---

## 1. Setting Up the Provider (`MediaProvider`)

Wrap your React root or container component with `<MediaProvider>` to supply the Pexels API key to the SDK context.

```tsx
import React from 'react';
import { MediaProvider } from '@my-media/react';
import { AppContent } from './AppContent';

export function App() {
  const pexelsApiKey = process.env.VITE_PEXELS_API_KEY || 'YOUR_PEXELS_API_KEY';

  return (
    <MediaProvider apiKey={pexelsApiKey} config={{ enableConsoleLogger: true }}>
      <AppContent />
    </MediaProvider>
  );
}
```

> [!IMPORTANT]
> Never hardcode production API keys in source files. Inject via environment variables (`process.env` or `import.meta.env`).

---

## 2. Searching Photos and Videos (`useMediaSearch`)

Use `useMediaSearch` to perform searches against Pexels API with pagination and infinite scroll support.

```tsx
import React, { useState } from 'react';
import { useMediaSearch } from '@my-media/react';
import { PexelsPhoto, PexelsVideo } from '@my-media/core';

export function SearchSection() {
  const [query, setQuery] = useState('nature');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  const { data, loading, error, hasMore, loadMore } = useMediaSearch<PexelsPhoto>(query, {
    type: mediaType,
    perPage: 15,
  });

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search photos or videos..."
      />

      {loading && <p>Loading media...</p>}
      {error && <p className="error">Error: {error.message}</p>}

      <div className="media-list">
        {data.map((item) => (
          <img key={item.id} src={item.src.medium} alt={item.alt} />
        ))}
      </div>

      {hasMore && !loading && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

---

## 3. Fetching Curated Feeds (`useMediaCurated`)

Use `useMediaCurated` to retrieve curated photos or popular video feeds.

```tsx
import React from 'react';
import { useMediaCurated } from '@my-media/react';

export function CuratedFeed() {
  const { data: photos, loading, loadMore } = useMediaCurated({
    type: 'photo',
    perPage: 20,
  });

  return (
    <section>
      <h2>Curated Photos</h2>
      {loading && <p>Loading curated feed...</p>}
      <div className="grid">
        {photos.map((photo) => (
          <img key={photo.id} src={photo.src.large} alt={photo.alt} />
        ))}
      </div>
      <button onClick={loadMore}>Load More Curated</button>
    </section>
  );
}
```

---

## 4. Listening to Telemetry Events (`useMediaEvents`)

Use `useMediaEvents` to react to user interactions like downloading media or viewing items.

```tsx
import React, { useState } from 'react';
import { useMediaEvents, useMediaClient } from '@my-media/react';
import { MediaEventPayload } from '@my-media/core';

export function EventLoggerToast() {
  const client = useMediaClient();
  const [lastEvent, setLastEvent] = useState<MediaEventPayload | null>(null);

  // Listen to all SDK events
  useMediaEvents((payload) => {
    setLastEvent(payload);
    console.log('[App Toast Log]', payload);
  });

  const triggerManualDownload = (photoId: number) => {
    client.trackDownload(photoId, 'photo');
  };

  return (
    <aside className="toast">
      {lastEvent ? (
        <p>
          Event Captured: <strong>{lastEvent.type}</strong> on item #{lastEvent.mediaId}
        </p>
      ) : (
        <p>No events recorded yet.</p>
      )}
    </aside>
  );
}
```

---

## 5. Architectural Checklist for AI Agents
- ✅ Wrap the top-most layout component inside `<MediaProvider>`.
- ✅ Access `MediaCoreClient` via `useMediaClient()` whenever manual imperative API calls or tracking calls (`trackDownload`, `trackView`) are needed.
- ✅ Always pass `type: 'photo'` or `type: 'video'` explicitly in options when searching or fetching feeds.
