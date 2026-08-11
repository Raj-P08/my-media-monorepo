---
name: using-components-skill
description: Guides AI assistants on consuming headless UI components (Grid, Lightbox, ReelSwiper), prop-getters pattern, custom styling integration, and WCAG accessibility standards.
---

# AI Skill: Consuming Headless UI Components (@my-media/ui-react)

This guide instructs AI assistants on how to build stunning, custom-styled media interfaces using unstyled headless components (`Grid`, `Lightbox`, `ReelSwiper`) and prop-getters from `@my-media/ui-react`.

---

## Strict Rule: Zero Core SDK Imports in UI Components

> [!CAUTION]
> Components from `@my-media/ui-react` MUST NEVER import from `@my-media/core` or wrapper packages.
> They accept generic data arrays `items: T[]` and render functions `renderItem: (item, index, props) => ReactNode`.

---

## 1. Building Responsive Media Grids (`Grid` & `useGrid`)

The `<Grid>` component handles multi-column responsive grid layout calculations and scroll threshold triggers for infinite pagination.

```tsx
import React from 'react';
import { Grid } from '@my-media/ui-react';
import { PexelsPhoto } from '@my-media/core';

interface MediaGridProps {
  photos: PexelsPhoto[];
  onLoadMore: () => void;
  onSelectPhoto: (photo: PexelsPhoto, index: number) => void;
}

export function CustomMediaGrid({ photos, onLoadMore, onSelectPhoto }: MediaGridProps) {
  return (
    <Grid
      items={photos}
      columns={3}
      gap={16}
      onLoadMore={onLoadMore}
      onItemSelect={onSelectPhoto}
      renderItem={(photo, index, itemProps) => (
        <div
          {...itemProps}
          key={itemProps.key}
          className="grid-card-wrapper"
          style={{
            cursor: 'pointer',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
          }}
        >
          <img
            src={photo.src.medium}
            alt={photo.alt || 'Pexels Photo'}
            style={{ width: '100%', height: '240px', objectFit: 'cover' }}
          />
          <div className="card-caption">
            <span>📷 {photo.photographer}</span>
          </div>
        </div>
      )}
    />
  );
}
```

---

## 2. Accessible Lightbox Modals (`Lightbox` & `useLightbox`)

The `<Lightbox>` component provides modal overlays, active item tracking, keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`), and focus lock.

```tsx
import React from 'react';
import { Lightbox } from '@my-media/ui-react';
import { PexelsPhoto } from '@my-media/core';

interface MediaLightboxProps {
  items: PexelsPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (photo: PexelsPhoto) => void;
}

export function CustomLightbox({
  items,
  initialIndex,
  isOpen,
  onClose,
  onDownload,
}: MediaLightboxProps) {
  return (
    <Lightbox
      items={items}
      initialIndex={initialIndex}
      isOpen={isOpen}
      onClose={onClose}
      renderContent={(photo, _index, controls) => (
        <div className="lightbox-content-box" style={{ color: '#fff', textAlign: 'center' }}>
          <img
            src={photo.src.large2x || photo.src.large}
            alt={photo.alt}
            style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: '8px' }}
          />

          <div className="lightbox-info">
            <h3>{photo.alt || 'Untitled Media'}</h3>
            <p>Photographer: {photo.photographer}</p>
          </div>

          <div className="lightbox-actions" style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button {...controls.getPrevButtonProps()} disabled={!controls.hasPrev}>
              ← Previous
            </button>
            <button
              onClick={() => onDownload(photo)}
              style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '6px' }}
            >
              📥 Download
            </button>
            <button {...controls.getNextButtonProps()} disabled={!controls.hasNext}>
              Next →
            </button>
            <button {...controls.getCloseButtonProps()} style={{ backgroundColor: '#ef4444', color: '#fff' }}>
              ✕ Close
            </button>
          </div>
        </div>
      )}
    />
  );
}
```

---

## 3. Short-Form Video Reels (`ReelSwiper` & `useReelSwiper`)

The `<ReelSwiper>` component implements vertical CSS snap-paging and active-item detection (60% visibility threshold).

```tsx
import React from 'react';
import { ReelSwiper } from '@my-media/ui-react';
import { PexelsVideo } from '@my-media/core';

interface ReelFeedProps {
  videos: PexelsVideo[];
  onActiveVideoChange?: (video: PexelsVideo, index: number) => void;
}

export function VerticalReelFeed({ videos, onActiveVideoChange }: ReelFeedProps) {
  return (
    <div style={{ height: '100vh', width: '100max', maxWidth: '480px', margin: '0 auto' }}>
      <ReelSwiper
        items={videos}
        onActiveChange={onActiveVideoChange}
        renderItem={(video, _index, isActive, itemProps) => {
          const videoFile = video.video_files.find((f) => f.quality === 'hd') || video.video_files[0];

          return (
            <div {...itemProps} key={itemProps.key} className="reel-slide">
              <video
                src={videoFile?.link}
                poster={video.image}
                autoPlay={isActive}
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="reel-overlay" style={{ position: 'absolute', bottom: '24px', left: '16px', color: '#fff' }}>
                <h4>@{video.user.name}</h4>
                <p>Duration: {video.duration}s</p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
```

---

## 4. Architectural Checklist for UI Assistants
- ✅ Always spread `itemProps` onto the outer node inside `renderItem`.
- ✅ Always use `controls.getCloseButtonProps()`, `getPrevButtonProps()`, and `getNextButtonProps()` in `<Lightbox>` to retain keyboard shortcuts and accessibility attributes.
- ✅ Utilize `isActive` in `<ReelSwiper>` to manage video play/pause states dynamically.
