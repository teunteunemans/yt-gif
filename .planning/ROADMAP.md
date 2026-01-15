# Roadmap: YT-GIF

## Overview

Build a cross-browser extension that adds GIF creation capability to YouTube videos. Starting with project foundation and cross-browser setup, then YouTube page integration, followed by the core GIF creation engine, and finishing with polish and store submission.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - WXT project setup with cross-browser config
- [x] **Phase 2: YouTube Integration** - Video detection and toolbar button injection
- [x] **Phase 3: GIF Creation** - Time range UI and video-to-GIF conversion
- [x] **Phase 4: Polish & Ship** - Quality options, download flow, store preparation
- [ ] **Phase 4.1: UX Polish (INSERTED)** - Draggable modal, improved time controls, toolbar integration

## Phase Details

### Phase 1: Foundation
**Goal**: Working WXT extension scaffold that loads in both Firefox and Chrome
**Depends on**: Nothing (first phase)
**Research**: Likely (WXT framework, cross-browser manifest differences)
**Research topics**: WXT project setup, manifest v2/v3 differences, Firefox vs Chrome extension API compatibility
**Plans**: TBD

Plans:
- [x] 01-01: WXT project scaffold with TypeScript and cross-browser config

### Phase 2: YouTube Integration
**Goal**: Extension detects YouTube videos and injects "GIF it!" button into video toolbar
**Depends on**: Phase 1
**Research**: Likely (YouTube page structure, content script injection)
**Research topics**: YouTube video player DOM structure, SPA navigation handling, toolbar element injection
**Plans**: TBD

Plans:
- [x] 02-01: YouTube content script with video detection and button injection

### Phase 3: GIF Creation
**Goal**: Users can select time range and generate GIF from YouTube video
**Depends on**: Phase 2
**Research**: Likely (client-side GIF encoding library)
**Research topics**: gif.js or alternatives, canvas video frame capture, performance optimization
**Plans**: TBD

Plans:
- [x] 03-01: Time range selection UI
- [x] 03-02: Video-to-GIF conversion engine

### Phase 4: Polish & Ship
**Goal**: Extension ready for Firefox Add-ons and Chrome Web Store submission
**Depends on**: Phase 3
**Research**: Unlikely (store submission is documented, internal polish)
**Plans**: TBD

Plans:
- [x] 04-01: Quality/size options and download flow
- [x] 04-02: Store assets and submission prep

### Phase 4.1: UX Polish (INSERTED)
**Goal**: Improve modal UX with draggable positioning, better time controls, and toolbar integration
**Depends on**: Phase 4
**Research**: Unlikely (implementation polish)
**Plans**: TBD

Plans:
- [ ] 04.1-01: Modal UX (styling, inline filename, time buttons, draggable)
- [ ] 04.1-02: External interactions (click-to-set-time, toolbar popup)

**Details:**
Fixes discovered during UAT:
1. Remove GIF button margin-top (visual alignment fix)
2. Red download button (matches branding)
3. Draggable modal without background darkening
4. Inline filename input (same view as quality settings)
5. Click video to set start time
6. Time adjustment buttons (+10s, +1s, +1 frame and minus variants)
7. Toolbar popup button opens GIF menu instead of counter

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 4.1

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-01-15 |
| 2. YouTube Integration | 1/1 | Complete | 2026-01-15 |
| 3. GIF Creation | 2/2 | Complete | 2026-01-15 |
| 4. Polish & Ship | 2/2 | Complete | 2026-01-15 |
| 4.1 UX Polish (INSERTED) | 0/2 | Not started | - |
