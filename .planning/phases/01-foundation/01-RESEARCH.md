# Phase 1: Foundation - Research

**Researched:** 2026-01-15
**Domain:** WXT browser extension framework with cross-browser support
**Confidence:** HIGH

<research_summary>
## Summary

Researched the WXT ecosystem for building cross-browser extensions targeting both Firefox and Chrome. WXT is the definitive leading framework for modern browser extension development in 2025-2026, providing a Vite-based architecture with excellent DX, automatic manifest generation, and seamless cross-browser builds from a single codebase.

Key finding: WXT handles the complexity of Manifest V2/V3 differences automatically. Write your manifest in V3 format, and WXT converts it for Firefox (MV2) or Chrome (MV3) as needed. The framework also provides a unified `browser` API that abstracts away the `chrome.*` vs `browser.*` namespace differences.

**Primary recommendation:** Use WXT with TypeScript and React. Start with `pnpm dlx wxt@latest init`, choose React template, configure `srcDir: 'src'` for cleaner structure. Build with `-b chrome` and `-b firefox` for separate outputs.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for cross-browser extension development:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| wxt | 0.20.13 | Extension framework | Best-in-class DX, handles cross-browser complexity, auto manifest generation |
| typescript | 5.x | Type safety | Built into WXT templates, catches errors at compile time |
| react | 18.x | UI framework | Excellent component model, WXT has first-class support via @wxt-dev/module-react |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @wxt-dev/module-react | latest | React integration | Enables React in HTML pages and content scripts |
| tailwindcss | 3.x | Styling | Utility-first CSS, works well with React components |
| zustand | 4.x | State management | Lightweight, works in extension contexts better than Redux |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React | Vue 3, Svelte | Vue/Svelte also have first-class WXT support; React chosen for broader ecosystem |
| WXT | Plasmo | Plasmo is React-only; WXT is framework-agnostic and more flexible |
| WXT | CRXJS | CRXJS is less actively maintained; WXT has superior cross-browser support |

**Installation:**
```bash
pnpm dlx wxt@latest init  # Choose React template
cd my-extension
pnpm install
pnpm install -D @wxt-dev/module-react tailwindcss
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
📂 project-root/
├── 📂 src/
│   ├── 📂 assets/           # CSS, images processed by WXT
│   ├── 📂 components/       # Auto-imported React components
│   ├── 📂 entrypoints/      # Extension entry points
│   │   ├── background.ts    # Service worker / background script
│   │   ├── content.ts       # Content script for YouTube
│   │   └── 📂 popup/        # Popup UI
│   │       ├── App.tsx
│   │       ├── index.html
│   │       └── main.tsx
│   ├── 📂 hooks/            # Auto-imported React hooks
│   └── 📂 utils/            # Auto-imported utilities
├── 📂 public/               # Static files (icons, etc.)
├── wxt.config.ts            # Main WXT configuration
├── tsconfig.json            # TypeScript config
└── package.json
```

### Pattern 1: Cross-Browser Configuration
**What:** Single wxt.config.ts with browser-conditional manifest
**When to use:** Always for cross-browser extensions
**Example:**
```typescript
// wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'YT-GIF',
    description: 'Create GIFs from YouTube videos',
    permissions: ['activeTab', 'storage'],
    // Firefox-specific settings
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'yt-gif@example.com',
          strict_min_version: '109.0'
        }
      }
    })
  })
});
```

### Pattern 2: Content Script with SPA Navigation
**What:** Handle YouTube's SPA navigation with WXT's location change event
**When to use:** Any content script targeting YouTube or other SPAs
**Example:**
```typescript
// entrypoints/content.ts
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main(ctx) {
    // Initial check
    if (window.location.pathname.startsWith('/watch')) {
      initGifButton();
    }

    // Handle SPA navigation
    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      if (newUrl.pathname.startsWith('/watch')) {
        initGifButton();
      }
    });
  }
});
```

### Pattern 3: Browser-Specific Runtime Detection
**What:** Conditionally run code based on target browser
**When to use:** When behavior must differ between browsers
**Example:**
```typescript
// Works at runtime
if (import.meta.env.FIREFOX) {
  // Firefox-specific code
}

if (import.meta.env.MANIFEST_VERSION === 2) {
  // MV2-specific code
}
```

### Anti-Patterns to Avoid
- **Manual manifest.json:** WXT generates this; don't create one manually
- **Using chrome.* directly:** Use WXT's `browser` object for cross-browser compatibility
- **Hardcoding browser detection:** Use `import.meta.env.BROWSER` instead of user agent sniffing
- **modules/ directory conflict:** Don't use `src/modules/` for your code; WXT reserves this for WXT modules
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Manifest generation | Manual manifest.json | WXT auto-generation | MV2/MV3 differences are complex; WXT handles conversion |
| Browser API polyfill | Custom wrappers | WXT's `browser` object | Handles chrome.* vs browser.* automatically |
| Cross-browser builds | Custom build scripts | `wxt -b firefox`, `wxt -b chrome` | Build flags handle all differences |
| Content script UI | Direct DOM manipulation | `createShadowRootUi()` | Isolates styles, prevents page CSS conflicts |
| SPA navigation detection | MutationObserver | `wxt:locationchange` event | WXT provides this; handles edge cases |
| Extension storage | localStorage | `browser.storage.local` | Syncs across contexts, persists properly |

**Key insight:** WXT exists specifically because cross-browser extension development has many subtle gotchas. The framework has solved years of edge cases. Fighting it leads to bugs on store submission or in specific browsers.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Module Directory Naming Conflict
**What goes wrong:** `wxt prepare` and dev commands fail
**Why it happens:** WXT reserves `modules/` for WXT modules; having `src/modules/` breaks the build
**How to avoid:** Name your code directories `lib/`, `services/`, or `features/` instead
**Warning signs:** Build errors mentioning module resolution

### Pitfall 2: Missing Firefox gecko.id
**What goes wrong:** Firefox rejects the extension on every update
**Why it happens:** Firefox requires a stable extension ID for updates
**How to avoid:** Add `browser_specific_settings.gecko.id` in manifest config
**Warning signs:** Different extension ID on each install, "extension already exists" errors

### Pitfall 3: CommonJS Imports
**What goes wrong:** Build fails with ESM/CJS errors
**Why it happens:** WXT only supports ESM; some npm packages are CJS-only
**How to avoid:** Ensure `"type": "module"` in package.json; use `.cjs` for any CJS config files
**Warning signs:** "require is not defined" or "cannot use import statement" errors

### Pitfall 4: Content Script Style Leaking
**What goes wrong:** Extension UI looks broken or page styles override your components
**Why it happens:** Content scripts share the page's CSS context by default
**How to avoid:** Use `createShadowRootUi()` with `cssInjectionMode: 'ui'`
**Warning signs:** Misaligned buttons, wrong fonts, styling differences between sites

### Pitfall 5: Permissions in Dev vs Production
**What goes wrong:** Extension works in dev but fails after building
**Why it happens:** WXT auto-adds `tabs` and `scripting` permissions in dev mode only
**How to avoid:** Explicitly declare all needed permissions in wxt.config.ts manifest
**Warning signs:** API errors only in production builds

### Pitfall 6: Fresh Browser Profile on Dev
**What goes wrong:** Settings/state lost on every dev server restart
**Why it happens:** WXT opens fresh browser profile by default
**How to avoid:** Configure `runner.chromiumArgs` with `--user-data-dir` or set `runner.disabled: true`
**Warning signs:** Having to re-enable extension, re-enter data on each dev cycle
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Basic WXT Project Setup
```typescript
// wxt.config.ts
// Source: WXT docs
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'YT-GIF',
    version: '1.0.0',
    description: 'Create GIFs from YouTube videos',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['*://*.youtube.com/*']
  }
});
```

### Background Script Entry
```typescript
// src/entrypoints/background.ts
// Source: WXT entrypoints docs
export default defineBackground(() => {
  console.log('YT-GIF background script loaded');

  // Listen for messages from content script
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'CREATE_GIF') {
      // Handle GIF creation request
      return Promise.resolve({ status: 'received' });
    }
  });
});
```

### Content Script with YouTube Detection
```typescript
// src/entrypoints/youtube.content.ts
// Source: WXT content scripts docs
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  runAt: 'document_idle',

  main(ctx) {
    const watchPattern = /^\/watch/;

    function maybeInjectButton() {
      if (watchPattern.test(window.location.pathname)) {
        injectGifButton();
      }
    }

    // Initial check
    maybeInjectButton();

    // Handle YouTube SPA navigation
    ctx.addEventListener(window, 'wxt:locationchange', () => {
      maybeInjectButton();
    });
  }
});

function injectGifButton() {
  // Button injection logic
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "wxt",
    "dev:firefox": "wxt -b firefox",
    "build": "wxt build",
    "build:firefox": "wxt build -b firefox",
    "zip": "wxt zip",
    "zip:firefox": "wxt zip -b firefox",
    "postinstall": "wxt prepare"
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Plasmo | WXT | 2024-2025 | WXT is now preferred for framework-agnostic projects |
| Manual manifest.json | WXT auto-generation | 2023+ | No need to maintain separate MV2/MV3 manifests |
| webextension-polyfill | WXT's built-in browser | 2024+ | WXT handles this internally |
| MV2 everywhere | MV3 for Chrome, MV2 for Firefox | 2025 | Chrome deprecated MV2 mid-2025 |

**New tools/patterns to consider:**
- **WXT 0.20+:** New `#imports` virtual module for cleaner imports
- **Chrome MV3:** Now required for Chrome Web Store (June 2025)
- **Firefox MV3:** Optional; Firefox still supports MV2 (recommended for broader compatibility)

**Deprecated/outdated:**
- **Chrome Manifest V2:** Fully deprecated as of June 2025
- **Manual browser polyfills:** WXT handles this automatically
- **CRXJS:** Less actively maintained; WXT preferred
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **YouTube DOM stability**
   - What we know: YouTube's player UI changes periodically
   - What's unclear: Exact selectors for toolbar injection (needs Phase 2 research)
   - Recommendation: Research YouTube DOM structure in Phase 2 before implementation

2. **Firefox MV3 vs MV2 for this project**
   - What we know: Firefox supports both; WXT defaults to MV2 for Firefox
   - What's unclear: Whether MV3 on Firefox offers any benefits for this use case
   - Recommendation: Use MV2 for Firefox (default) for maximum compatibility
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [WXT Official Documentation](https://wxt.dev/) - Installation, configuration, entrypoints, project structure
- [WXT GitHub](https://github.com/wxt-dev/wxt) - Version 0.20.13, active maintenance confirmed
- [MDN Chrome Incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities) - Cross-browser API differences

### Secondary (MEDIUM confidence)
- [2025 State of Browser Extension Frameworks](https://redreamality.com/blog/the-2025-state-of-browser-extension-frameworks-a-comparative-analysis-of-plasmo-wxt-and-crxjs/) - WXT as preferred framework verified
- [Building AI-Powered Browser Extensions With WXT](https://marmelab.com/blog/2025/04/15/browser-extension-form-ai-wxt.html) - Development patterns verified
- [WXT Discussions #922](https://github.com/wxt-dev/wxt/discussions/922) - Common pitfalls verified

### Tertiary (LOW confidence - needs validation)
- None - all critical findings verified against official sources
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: WXT v0.20.13
- Ecosystem: React, TypeScript, Tailwind CSS
- Patterns: Cross-browser config, content scripts, SPA navigation
- Pitfalls: Module naming, permissions, styles, Firefox gecko.id

**Confidence breakdown:**
- Standard stack: HIGH - verified with WXT docs, widely adopted
- Architecture: HIGH - from official WXT documentation and examples
- Pitfalls: HIGH - documented in GitHub discussions and official docs
- Code examples: HIGH - from official WXT documentation

**Research date:** 2026-01-15
**Valid until:** 2026-02-15 (30 days - WXT ecosystem stable)
</metadata>

---

*Phase: 01-foundation*
*Research completed: 2026-01-15*
*Ready for planning: yes*
