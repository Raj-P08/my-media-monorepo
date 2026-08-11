# Headless Media SDK & Component Library Monorepo

A modular, framework-agnostic media SDK, platform wrappers, pure unstyled headless UI component libraries, and consumer web application powered by the Pexels API.

---

## 🏗️ Architecture & Package Breakdown

```
my-media-monorepo/
├── packages/
│   ├── media-core/         # Framework-agnostic core SDK (Pure TypeScript, Zero UI dependencies)
│   ├── media-react/        # React wrapper (Context Provider & hooks like useMediaSearch, useMediaCurated)
│   ├── media-native/       # React Native wrapper (Mirroring React contract for mobile)
│   ├── media-ui-react/     # Pure Headless UI for React (Zero core imports - Grid, Lightbox, ReelSwiper)
│   └── media-ui-native/    # Pure Headless UI for React Native (Zero core imports - Grid, Lightbox, ReelSwiper)
├── apps/
│   └── web-app/            # Consumer React application (Wires media-react + media-ui-react)
└── skills/
    ├── wiring-data-skill.md     # AI Skill teaching data wiring & event handling
    └── using-components-skill.md # AI Skill teaching headless UI consumption & styling
```

---

## 🔒 Architectural Boundaries & Strict Rules

1. **`@my-media/core`**: Zero UI dependencies, zero React dependencies. Implements Pexels API HTTP fetcher with `Authorization` key injection, TTL response caching (`MediaCacheManager`), inflight request deduplication, and a typed publish/subscribe event emitter (`MediaEventEmitter`).
2. **`@my-media/react` & `@my-media/native`**: Platform wrappers. Allowed to import `@my-media/core`. Contain zero complex rendering or UI components—only React Context (`<MediaProvider>`), custom data hooks (`useMediaSearch`, `useMediaCurated`), and event tracking (`useMediaEvents`).
3. **`@my-media/ui-react` & `@my-media/ui-native`**: Pure Headless UI component libraries using Hooks + Prop-Getters pattern (`Grid`, `Lightbox`, `ReelSwiper`). **STRICT CONSTRAINT**: Absolutely ZERO imports from `@my-media/core` or wrapper packages. Components take raw data arrays (`items: T[]`) and render callbacks (`renderItem`) purely as generic props.
4. **`apps/web-app`**: Consumer React Web App. Integrates `@my-media/react` for data fetching/telemetry and `@my-media/ui-react` for responsive grid layout, lightbox modal, and TikTok-style vertical reel swiper.

---

## 🤖 AI-Assisted vs Hand-Written Breakdown

| Component / Layer | Part Type | Implementation Details |
| :--- | :--- | :--- |
| **`@my-media/core`** | Hand-Designed Architecture | Pexels REST schemas, TTL cache manager, inflight deduplication map, typed event emitter. |
| **`@my-media/react`** | AI-Generated Wrapper | `MediaContext` provider, `useMediaSearch`, `useMediaCurated`, and `useMediaEvents` hooks. |
| **`@my-media/native`** | AI-Generated Wrapper | Parallel React Native hook contracts mirroring web wrappers. |
| **`@my-media/ui-react`** | Hand-Designed Headless Hooks | `useGrid` layout triggers, `useLightbox` keyboard handlers (`Escape`, arrows), `useReelSwiper` IntersectionObserver active item detection. |
| **`@my-media/ui-native`** | AI-Generated UI Hooks | React Native layout prop-getters and FlatList hooks. |
| **`apps/web-app`** | AI-Generated Web App | Glassmorphism dark UI, search header, category pills, grid layout, lightbox modal, reel feed, live telemetry toasts. |
| **`skills/*.md`** | Hand-Written Instruction Skills | AI agent training guides for data wiring (`wiring-data-skill.md`) and headless UI consumption (`using-components-skill.md`). |

---

## ⚡ Getting Started & Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Install all monorepo dependencies
npm install
```

### Type Checking & Validation
```bash
# Type check all packages across the monorepo
npm run check-types
```

### Running the Consumer Web App
```bash
# Start the Vite development server for apps/web-app
npm --workspace=apps/web-app run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Boundary Verification Checklist

- [x] **Core Agnostic**: `packages/media-core` contains 0 imports of `react`, `react-dom`, or UI packages.
- [x] **Wrapper Scoping**: `packages/media-react` and `packages/media-native` import `@my-media/core` only for hooks/providers and contain zero UI styling or DOM elements.
- [x] **Zero Core Imports in UI**: `packages/media-ui-react` and `packages/media-ui-native` have zero imports from `@my-media/core` or wrapper packages.
- [x] **Prop-Getter Standard**: Headless components export `getGridProps()`, `getItemProps()`, `getOverlayProps()`, `getContentProps()`, `getCloseButtonProps()`, etc.
- [x] **Telemetry & Events**: `trackDownload()` and `trackView()` emit events through `MediaEventEmitter` to consumer listeners (`useMediaEvents`).
