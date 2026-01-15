# YT-GIF

## What This Is

A cross-browser extension (Firefox + Chrome) that adds a "GIF it!" button to YouTube videos, allowing users to select a time range and create an animated GIF from that segment. Inspired by GIFit, but built from scratch for publishing on both browser extension stores.

## Core Value

Simple, one-click GIF creation from YouTube videos directly in the browser.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] YouTube video detection and toolbar button injection
- [ ] Time range selection UI (start/end markers on video timeline)
- [ ] Video-to-GIF conversion in the browser
- [ ] GIF quality/size configuration options
- [ ] GIF download to local filesystem
- [ ] Cross-browser support (Firefox + Chrome from same codebase)

### Out of Scope

- Video format exports (MP4/WebM) — GIF only for v1
- Cloud upload (Giphy/Imgur) — local download only
- Advanced editing (text overlays, filters, effects) — keep it simple
- Support for non-YouTube video sites — YouTube focus only

## Context

The existing GIFit extension (github.com/takempf/GIFit) provides similar functionality but is only published on the Chrome Web Store, not Firefox Add-ons. The user wants to build a fresh implementation that can be published to both stores.

GIFit uses React, TypeScript, and WXT (Vite-based build system). This project can draw inspiration from that architecture while being an independent implementation.

## Constraints

- **Distribution**: Must pass Firefox Add-ons and Chrome Web Store review policies
- **Same codebase**: Single codebase producing builds for both browsers
- **Client-side**: All GIF conversion must happen in-browser (no external services)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| YouTube-only focus | Simplifies v1 scope, user's primary use case | — Pending |
| GIF-only output | Keep v1 minimal, avoid scope creep | — Pending |
| Cross-browser from start | Avoid rewrite later, user wants both stores | — Pending |

---
*Last updated: 2026-01-15 after initialization*
