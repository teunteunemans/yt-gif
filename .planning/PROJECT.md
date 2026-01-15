# YT-GIF

## What This Is

A cross-browser extension (Firefox + Chrome) that adds a "GIF" button to YouTube videos, allowing users to select a time range and create an animated GIF with draggable modal UI, time adjustment controls, and instant preview. Shipped v1.0 with full GIF encoding pipeline.

## Core Value

Simple, one-click GIF creation from YouTube videos directly in the browser.

## Requirements

### Validated

- ✓ YouTube video detection and toolbar button injection — v1.0
- ✓ Time range selection UI (MM:SS input format) — v1.0
- ✓ Video-to-GIF conversion in the browser (gifenc) — v1.0
- ✓ GIF quality/size configuration options (FPS: 5/10/15, Width: 320/480/640) — v1.0
- ✓ GIF download to local filesystem with preview — v1.0
- ✓ Cross-browser support (Firefox MV2 + Chrome MV3 from same codebase) — v1.0

### Active

- [ ] Store submission (Firefox Add-ons, Chrome Web Store)
- [ ] User feedback collection and iteration

### Out of Scope

- Video format exports (MP4/WebM) — GIF only for v1
- Cloud upload (Giphy/Imgur) — local download only
- Advanced editing (text overlays, filters, effects) — keep it simple
- Support for non-YouTube video sites — YouTube focus only

## Context

Shipped v1.0 MVP with 1,167 lines of TypeScript in 2 hours.
Tech stack: WXT 0.20.13, React 19, TypeScript, gifenc for GIF encoding.
Build outputs: Chrome MV3 (~432 kB), Firefox MV2 (~432 kB).

The existing GIFit extension (github.com/takempf/GIFit) provided inspiration but this is an independent implementation published to both stores.

## Constraints

- **Distribution**: Must pass Firefox Add-ons and Chrome Web Store review policies
- **Same codebase**: Single codebase producing builds for both browsers
- **Client-side**: All GIF conversion must happen in-browser (no external services)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| YouTube-only focus | Simplifies v1 scope, user's primary use case | ✓ Good |
| GIF-only output | Keep v1 minimal, avoid scope creep | ✓ Good |
| Cross-browser from start | Avoid rewrite later, user wants both stores | ✓ Good |
| WXT with React | Modern tooling, familiar patterns | ✓ Good |
| Shadow DOM for UI | CSS isolation from YouTube styles | ✓ Good |
| gifenc over gif.js | ESM support, faster, browser-native | ✓ Good |
| Seek-based frame capture | Precision frame extraction | ✓ Good |
| MM:SS time format | Familiar video timestamp pattern | ✓ Good |
| Draggable modal without overlay | Video remains visible while editing | ✓ Good |
| Time adjustment buttons | Precise frame-level control | ✓ Good |

---
*Last updated: 2026-01-15 after v1.0 milestone*
