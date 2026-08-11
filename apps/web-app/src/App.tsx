import { useState, useEffect } from 'react';
import {
  MediaProvider,
  useMediaSearch,
  useMediaCurated,
  useMediaClient,
} from '@my-media/react';
import { Grid, Lightbox, ReelSwiper } from '@my-media/ui-react';
import { PexelsPhoto, PexelsVideo } from '@my-media/core';

const PEXELS_API_KEY =
  import.meta.env.VITE_PEXELS_API_KEY ||
  'gbl5fjtUAVMYo8YU9goIDpvPKmrlP5raGoC17qFsZzeSNRIhSmJ5szkN';

function useResponsiveColumns(): number {
  const [columns, setColumns] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1536) return 3;
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else if (width < 1536) setColumns(3);
      else setColumns(4);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}

function MediaAppContent() {
  const client = useMediaClient();
  const responsiveColumns = useResponsiveColumns();
  const [activeTab, setActiveTab] = useState<'photos' | 'video-grid' | 'reels'>('photos');
  const [searchQuery, setSearchQuery] = useState('nature');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  // 1. Fetch Photos for Grid
  const photoSearch = useMediaSearch<PexelsPhoto>(searchQuery, {
    type: 'photo',
    perPage: 18,
    enabled: activeTab === 'photos' && searchQuery.trim() !== '',
  });

  const photoCurated = useMediaCurated<PexelsPhoto>({
    type: 'photo',
    perPage: 18,
    enabled: activeTab === 'photos' && searchQuery.trim() === '',
  });

  const photos = searchQuery.trim() ? photoSearch.data : photoCurated.data;
  const loadingPhotos = searchQuery.trim() ? photoSearch.loading : photoCurated.loading;
  const hasMorePhotos = searchQuery.trim() ? photoSearch.hasMore : photoCurated.hasMore;
  const loadMorePhotos = searchQuery.trim() ? photoSearch.loadMore : photoCurated.loadMore;

  // 2. Fetch Videos (for Video Grid and Video Reels)
  const videoSearch = useMediaSearch<PexelsVideo>(searchQuery || 'nature', {
    type: 'video',
    perPage: 12,
    enabled: activeTab === 'video-grid' || activeTab === 'reels',
  });

  const handlePhotoClick = (photo: PexelsPhoto, index: number) => {
    setSelectedPhotoIndex(index);
    client.trackView(photo.id, 'photo', photo);
  };

  const handleDownloadPhoto = (photo: PexelsPhoto) => {
    client.trackDownload(photo.id, 'photo', photo);
    window.open(photo.src.original, '_blank');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient Mesh Glow Blobs */}
      <div className="bg-mesh">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />
      </div>

      {/* Glassmorphism Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-top">
            <div className="brand-badge">
              <div className="brand-logo-icon">Æ</div>
              <div className="brand-title-text">
                <h1>AETHER</h1>
                <div className="brand-subtitle">Headless Media Architecture</div>
              </div>
            </div>

            {/* Editorial Segment Switcher */}
            <div className="segment-tabs">
              <button
                className={`segment-btn ${activeTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                📷 Photos
              </button>
              <button
                className={`segment-btn ${activeTab === 'video-grid' ? 'active' : ''}`}
                onClick={() => setActiveTab('video-grid')}
              >
                🎥 Videos Grid
              </button>
              <button
                className={`segment-btn ${activeTab === 'reels' ? 'active' : ''}`}
                onClick={() => setActiveTab('reels')}
              >
                🎬 Video Reels
              </button>
            </div>
          </div>

          {/* Command Search Bar */}
          <div className="search-container">
            <input
              type="text"
              className="search-input-box"
              placeholder="Search high-res photography & videos (e.g. Cyberpunk, Architecture, Ocean)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-lens-icon">🔍</span>
          </div>
        </div>
      </header>

      {/* Main Display Container */}
      <main className="app-main">
        {/* 1. Photos Grid View */}
        {activeTab === 'photos' && (
          <div>
            <div className="results-meta-bar">
              <div className="results-meta-title">
                Photography Collection
              </div>
            </div>

            {photos.length === 0 && !loadingPhotos && (
              <p style={{ textAlign: 'center', color: '#64748b', margin: '60px 0', fontSize: '1.1rem' }}>
                No photography found for "{searchQuery}". Explore a different query!
              </p>
            )}

            {/* Pure Headless Grid Component */}
            <Grid
              items={photos}
              columns={responsiveColumns}
              gap={24}
              onLoadMore={loadMorePhotos}
              onItemSelect={handlePhotoClick}
              renderItem={(photo, _idx, itemProps) => (
                <div {...itemProps} key={itemProps.key} className="editorial-card">
                  <div className="editorial-card-media">
                    <img
                      src={photo.src.large}
                      alt={photo.alt || 'Pexels Media'}
                      loading="lazy"
                    />
                  </div>
                  <div className="editorial-card-caption">
                    <div className="card-title-text">{photo.alt || 'Untitled Specimen'}</div>
                    <div className="card-author-tag">
                      <span>👤 {photo.photographer}</span>
                    </div>
                  </div>
                </div>
              )}
            />

            {loadingPhotos && (
              <p style={{ textAlign: 'center', color: '#6366f1', margin: '36px 0', fontWeight: 700, fontSize: '1rem' }}>
                ✦ Curating Next Batch...
              </p>
            )}

            {!loadingPhotos && hasMorePhotos && photos.length > 0 && (
              <div style={{ textAlign: 'center', margin: '48px 0' }}>
                <button onClick={loadMorePhotos} className="cta-button">
                  Load More Photography ↓
                </button>
              </div>
            )}

            {/* Pure Headless Lightbox Component for Photos */}
            <Lightbox
              items={photos}
              initialIndex={selectedPhotoIndex ?? 0}
              isOpen={selectedPhotoIndex !== null}
              onClose={() => setSelectedPhotoIndex(null)}
              renderContent={(photo, _idx, controls) => (
                <div className="awwwards-lightbox-card">
                  <img
                    src={photo.src.large2x || photo.src.large}
                    alt={photo.alt}
                    className="custom-lightbox-img"
                  />
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: '#0f172a' }}>
                      {photo.alt || 'Untitled Specimen'}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      Artist: {photo.photographer}
                    </p>
                  </div>
                  <div className="custom-lightbox-toolbar">
                    <button {...controls.getPrevButtonProps()} className="cta-button secondary">
                      ← Prev
                    </button>
                    <button
                      className="cta-button"
                      onClick={() => handleDownloadPhoto(photo)}
                    >
                      📥 Download Original
                    </button>
                    <button {...controls.getNextButtonProps()} className="cta-button secondary">
                      Next →
                    </button>
                    <button
                      {...controls.getCloseButtonProps()}
                      className="cta-button danger"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* 2. Videos Grid View */}
        {activeTab === 'video-grid' && (
          <div>
            <div className="results-meta-bar">
              <div className="results-meta-title">
                Cinematic Motion Collection
              </div>
            </div>

            {videoSearch.data.length === 0 && !videoSearch.loading && (
              <p style={{ textAlign: 'center', color: '#64748b', margin: '60px 0', fontSize: '1.1rem' }}>
                No video motion found for "{searchQuery}". Try another search!
              </p>
            )}

            {/* Pure Headless Grid Component for Videos */}
            <Grid
              items={videoSearch.data}
              columns={responsiveColumns}
              gap={24}
              onLoadMore={videoSearch.loadMore}
              onItemSelect={(video, index) => {
                setSelectedVideoIndex(index);
                client.trackView(video.id, 'video', video);
              }}
              renderItem={(video: PexelsVideo, _idx, itemProps) => (
                <div {...itemProps} key={itemProps.key} className="editorial-card">
                  <div className="editorial-card-media">
                    <img
                      src={video.image}
                      alt={`Video by ${video.user.name}`}
                      loading="lazy"
                    />
                    <span className="card-badge-duration">
                      ⏱ {video.duration}s
                    </span>
                    <div className="card-play-orb">▶</div>
                  </div>
                  <div className="editorial-card-caption">
                    <div className="card-title-text">🎥 Motion by {video.user.name}</div>
                    <div className="card-author-tag">
                      <span>Dimensions: {video.width} × {video.height}</span>
                    </div>
                  </div>
                </div>
              )}
            />

            {videoSearch.loading && (
              <p style={{ textAlign: 'center', color: '#6366f1', margin: '36px 0', fontWeight: 700, fontSize: '1rem' }}>
                ✦ Loading Motion Streams...
              </p>
            )}

            {!videoSearch.loading && videoSearch.hasMore && videoSearch.data.length > 0 && (
              <div style={{ textAlign: 'center', margin: '48px 0' }}>
                <button onClick={videoSearch.loadMore} className="cta-button">
                  Load More Motion Streams ↓
                </button>
              </div>
            )}

            {/* Video Lightbox Player Modal */}
            <Lightbox
              items={videoSearch.data}
              initialIndex={selectedVideoIndex ?? 0}
              isOpen={selectedVideoIndex !== null}
              onClose={() => setSelectedVideoIndex(null)}
              renderContent={(video, _idx, controls) => {
                const videoFile =
                  video.video_files.find((f: any) => f.quality === 'hd') ||
                  video.video_files[0];
                return (
                  <div className="awwwards-lightbox-card" style={{ maxWidth: '840px', width: '90vw' }}>
                    <video
                      src={videoFile?.link}
                      poster={video.image}
                      controls
                      autoPlay
                      style={{ maxHeight: '65vh', width: '100%', borderRadius: '16px' }}
                    />
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: '#0f172a' }}>
                        🎥 Motion Stream by {video.user.name}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Duration: {video.duration}s | Quality: {videoFile?.quality?.toUpperCase() || 'SD'}
                      </p>
                    </div>
                    <div className="custom-lightbox-toolbar">
                      <button {...controls.getPrevButtonProps()} className="cta-button secondary">
                        ← Prev
                      </button>
                      <button
                        className="cta-button"
                        onClick={() => {
                          client.trackDownload(video.id, 'video', video);
                          window.open(videoFile?.link, '_blank');
                        }}
                      >
                        📥 Download Video Stream
                      </button>
                      <button {...controls.getNextButtonProps()} className="cta-button secondary">
                        Next →
                      </button>
                      <button
                        {...controls.getCloseButtonProps()}
                        className="cta-button danger"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}

        {/* 3. Video Reels View */}
        {activeTab === 'reels' && (
          <div className="awwwards-reel-frame">
            {videoSearch.loading && videoSearch.data.length === 0 && (
              <p style={{ textAlign: 'center', color: '#6366f1', padding: '60px', fontWeight: 600 }}>
                ✦ Loading Motion Reels...
              </p>
            )}

            {/* Pure Headless Reel Swiper Component with Auto Infinite Scroll */}
            <ReelSwiper
              items={videoSearch.data}
              onLoadMore={videoSearch.loadMore}
              onActiveChange={(video) => client.trackView(video.id, 'video', video)}
              renderItem={(video: PexelsVideo, _index: number, isActive: boolean, itemProps: any) => {
                const videoFile =
                  video.video_files.find((f: any) => f.quality === 'hd') ||
                  video.video_files[0];
                return (
                  <div {...itemProps} key={itemProps.key} className="reel-slide-card">
                    <video
                      src={videoFile?.link}
                      poster={video.image}
                      autoPlay={isActive}
                      loop
                      muted
                      playsInline
                      className="reel-video"
                    />
                    <div className="reel-overlay-content">
                      <div className="reel-user-tag">🎥 @{video.user.name}</div>
                      <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                        Duration: {video.duration}s | {video.width} × {video.height}
                      </p>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <MediaProvider apiKey={PEXELS_API_KEY} config={{ enableConsoleLogger: true }}>
      <MediaAppContent />
    </MediaProvider>
  );
}

export default App;
