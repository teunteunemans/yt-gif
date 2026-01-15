# Phase 3 Discovery: GIF Creation

## Research Question
How to capture YouTube video frames and encode them into GIF format client-side?

## Discovery Level
Level 2 (Standard Research) - Choosing GIF encoding library and understanding video capture approach.

## Findings

### GIF Encoding Library: gifenc

**Selected:** [gifenc](https://github.com/mattdesl/gifenc) by mattdesl

**Why gifenc over alternatives:**
- **gif.js** - Older, last updated 2017, no ESM support, requires separate worker file
- **gifshot** (Yahoo) - Archived 2020, designed for webcam capture not video scrubbing
- **gifenc** - Fast, ESM support, browser-compatible, used by GIFit reference implementation

**API Pattern:**
```typescript
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

// For each frame:
const palette = quantize(rgbaData, 256);
const indexed = applyPalette(rgbaData, palette);
encoder.writeFrame(indexed, width, height, { palette, delay });

// Final output:
encoder.finish();
const blob = new Blob([encoder.bytes()], { type: 'image/gif' });
```

### Video Frame Capture Approach

**Method:** Canvas `drawImage()` + `getImageData()`

1. Seek video to target frame time (`video.currentTime = time`)
2. Wait for seek complete (`video.onseeked` event)
3. Draw video frame to canvas (`ctx.drawImage(video, ...)`)
4. Extract pixel data (`ctx.getImageData(...)`)
5. Process through gifenc quantization and encoding

**CORS Considerations:**
- Content scripts run in page context - same-origin access to video element
- Most YouTube videos are NOT DRM-protected, so canvas operations work
- DRM-protected videos (EME/Widevine) would fail with `NotSupportedError` on `captureStream()` or tainted canvas errors - acceptable limitation

### Reference Implementation

[GIFit extension](https://github.com/takempf/GIFit) uses identical approach:
- GifService.ts uses gifenc
- Canvas drawImage for frame capture
- No CORS handling (relies on content script context)
- Confirmed working on YouTube

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use gifenc library | Fast, ESM, browser-ready, proven in GIFit |
| Canvas drawImage approach | Direct video frame access, works in content script |
| Accept DRM limitation | Most YT videos work; DRM videos fail gracefully |
| No Web Workers initially | Keep simple for v1; optimize if needed |

## Sources

- [gifenc GitHub](https://github.com/mattdesl/gifenc)
- [GIFit source code](https://github.com/takempf/GIFit)
- [MDN: CORS and tainted canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image)
- [Chrome Extension content script CORS](https://www.chromium.org/Home/chromium-security/extension-content-script-fetches/)
