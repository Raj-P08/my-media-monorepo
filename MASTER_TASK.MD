Headless Media SDK & Component Library

System Instruction for AI Agent: You are an expert Senior React/React Native Architect. We are building a modular Monorepo project featuring a framework-agnostic core media SDK, platform wrappers, pure headless UI component libraries, and a consumer web application using the Pexels API.

CRITICAL RULE FOR EXECUTION: Execute this plan strictly step-by-step. For every single step, you must first output a brief explanation of What you are building, Why it is needed based on the architecture, and How it works. Only after explaining, generate the code files for that step. Do not skip ahead or bundle steps together.

Phase 0: Monorepo Structure & Workspace Initialization
Goal: Set up a clean monorepo workspace (using npm workspaces or Turborepo/pnpm workspaces) with proper TypeScript configurations.

Directory Structure to create:

Plaintext


my-media-monorepo/
├── packages/
│   ├── media-core/         # Framework-agnostic core SDK
│   ├── media-react/        # React wrapper (depends on media-core)
│   ├── media-native/       # React Native wrapper (depends on media-core)
│   ├── media-ui-react/     # Pure headless UI for React (Zero core imports)
│   └── media-ui-native/    # Pure headless UI for React Native (Zero core imports)
└── apps/
    └── web-app/            # Consumer React app (Wires media-react + media-ui-react)
AI Action: Initialize the workspaces, root package.json, and base tsconfig.json. Ensure strict boundary enforcement rules in descriptions.


Phase 1: Build media-core (The Agnostic Engine)
Goal: Build the pure TypeScript SDK with zero UI or React dependencies.

Requirements:

Pexels API Client: Support search, curated/trending feeds, pagination (page/per_page), and single item fetch (photo/video).

Auth Handling: Secure storage/passing of API key via initialization config. No leakage.

Event Emitter: A lightweight publish/subscribe pattern emitting at least download and view events. Include a default console logger listener.

Caching/De-dupe: Basic in-memory caching or request deduplication layer for API responses.

Types: Fully typed response interfaces for photos, videos, search queries, and errors.

Phase 2: Build Platform Wrappers (media-react & media-native)
Goal: Adapt media-core into idiomatic React and React Native hooks and context providers.

Requirements:

media-react:

MediaProvider component to initialize the SDK with the Pexels API key.

Custom hooks (e.g., useMediaSearch, useMediaCurated, useMediaEvents) that cleanly expose core features, loading/error states, and event triggering.

media-native:

Mirror the exact same contract/hooks for React Native environment.

Boundary Check: These are the only packages allowed to import media-core. They contain zero complex UI components, only data/state logic.

Phase 3: Build Headless Component Libraries (media-ui-react & media-ui-native)
Goal: Build pure UI, unstyled headless components using the Hooks + Prop-Getters pattern.

Strict Constraint: Zero imports from media-core or wrappers. They take raw data arrays and callbacks purely as props.

Components to build:

Grid Component: Handles virtualized or standard infinite scrolling / load-more triggers using a headless hook (useGrid).

Lightbox Component: Manages open/close state, active media item, and keyboard/focus management (for web accessibility). Built using useLightbox.

Reel Swiper Component: Vertical snap paging layout tracking active-item visibility/detection via useReelSwiper.

Phase 4: Create AI Agent Skills (SKILL.md documents)
Goal: Write two robust Markdown instruction files that teach AI assistants how to use this ecosystem.

Files to create:

skills/wiring-data-skill.md: Guides an AI on how to setup MediaProvider, handle auth, invoke search/curated hooks, and listen to SDK events (download/view).

skills/using-components-skill.md: Guides an AI on how to consume media-ui-react components, consume prop-getters, apply custom markup/styling, and handle accessibility (a11y).

Phase 5: Build UI App (apps/web-app)Goal: Create a functional React Web Application that wires everything together.Wiring Requirements:Imports media-react for data fetching, state, and event tracking.Imports media-ui-react for layout rendering.User Flow Implementation:Search bar at the top $\rightarrow$ Submits query to media-react hook.Results rendered using media-ui-react Grid with infinite scroll.Tapping a grid item opens the Lightbox.A secondary toggle or section displaying a Reels-style view using the Reel Swiper component for video results.Console logging or UI toast showing captured download and view events from the core event emitter.

Phase 6: Documentation & Verification
Goal: Prepare project documentation and verify dependency directions.

Deliverables:

Comprehensive README.md explaining architecture, setup instructions, and explicitly noting which parts were AI-assisted vs hand-written.

Verification checklist confirming that components do not import core, and wrappers cleanly abstract core logic.