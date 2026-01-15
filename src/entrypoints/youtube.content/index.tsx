import { createShadowRootUi, type ShadowRootContentScriptUi } from 'wxt/utils/content-script-ui/shadow-root';
import { createRoot, type Root } from 'react-dom/client';
import App from './App';

export default defineContentScript({
  matches: ['*://*.youtube.com/watch*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const TOOLBAR_SELECTOR = '#top-level-buttons-computed';
    const BUTTON_CONTAINER_ID = 'yt-gif-button-container';

    // Track current UI instance for cleanup
    let currentUi: ShadowRootContentScriptUi<Root> | null = null;

    // Wait for toolbar to appear using MutationObserver
    async function waitForToolbar(timeout = 10000): Promise<Element | null> {
      if (!ctx.isValid) return null;

      const toolbar = document.querySelector(TOOLBAR_SELECTOR);
      if (toolbar) return toolbar;

      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          if (!ctx.isValid) {
            observer.disconnect();
            resolve(null);
            return;
          }

          const toolbar = document.querySelector(TOOLBAR_SELECTOR);
          if (toolbar) {
            observer.disconnect();
            resolve(toolbar);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Timeout fallback
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
      });
    }

    // Clean up existing button and UI instance
    function cleanup() {
      if (currentUi) {
        currentUi.remove();
        currentUi = null;
      }

      // Also remove orphaned container if exists
      const existing = document.getElementById(BUTTON_CONTAINER_ID);
      if (existing) {
        existing.remove();
      }
    }

    // Inject the GIF button UI
    async function injectButton() {
      if (!ctx.isValid) return;

      // Clean up any existing instance first
      cleanup();

      const toolbar = await waitForToolbar();
      if (!toolbar || !ctx.isValid) return;

      // Double-check no duplicate exists
      if (document.getElementById(BUTTON_CONTAINER_ID)) return;

      // Create anchor element for shadow root
      const anchor = document.createElement('div');
      anchor.id = BUTTON_CONTAINER_ID;
      anchor.style.display = 'inline-flex';
      anchor.style.alignItems = 'center';
      anchor.style.height = '36px';
      anchor.style.margin = '0';
      anchor.style.padding = '0';

      // Insert at the end of toolbar (after like/dislike buttons)
      toolbar.appendChild(anchor);

      try {
        const ui = await createShadowRootUi(ctx, {
          name: 'yt-gif-button',
          position: 'inline',
          anchor,
          onMount: (container) => {
            const root = createRoot(container);
            root.render(<App />);
            return root;
          },
          onRemove: (root) => {
            root?.unmount();
          },
        });

        ui.mount();
        currentUi = ui;
      } catch (error) {
        // Clean up anchor if UI creation fails
        anchor.remove();
        console.error('YT-GIF: Failed to create button UI', error);
      }
    }

    // Check if on watch page
    function isWatchPage(): boolean {
      return window.location.pathname === '/watch';
    }

    // Handle SPA navigation
    ctx.addEventListener(window, 'wxt:locationchange', async () => {
      if (!ctx.isValid) return;

      if (isWatchPage()) {
        // Small delay to let YouTube's DOM update after navigation
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (ctx.isValid) {
          await injectButton();
        }
      } else {
        // Navigated away from watch page - clean up
        cleanup();
      }
    });

    // Also listen for YouTube's native navigation event as backup
    ctx.addEventListener(window, 'yt-navigate-finish' as keyof WindowEventMap, async () => {
      if (!ctx.isValid) return;

      if (isWatchPage()) {
        // Delay to ensure toolbar is rendered
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (ctx.isValid) {
          await injectButton();
        }
      } else {
        cleanup();
      }
    });

    // Initial injection
    if (isWatchPage()) {
      await injectButton();
    }

    console.log('YT-GIF content script loaded');
  },
});
