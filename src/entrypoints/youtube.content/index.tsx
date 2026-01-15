import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { createRoot } from 'react-dom/client';
import App from './App';

export default defineContentScript({
  matches: ['*://*.youtube.com/watch*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const TOOLBAR_SELECTOR = '#top-level-buttons-computed';
    const BUTTON_CONTAINER_ID = 'yt-gif-button-container';

    // Wait for toolbar to appear using MutationObserver
    async function waitForToolbar(timeout = 10000): Promise<Element | null> {
      const toolbar = document.querySelector(TOOLBAR_SELECTOR);
      if (toolbar) return toolbar;

      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
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

    // Inject the GIF button UI
    async function injectButton() {
      if (!ctx.isValid) return;

      // Check if already injected
      if (document.getElementById(BUTTON_CONTAINER_ID)) return;

      const toolbar = await waitForToolbar();
      if (!toolbar || !ctx.isValid) return;

      // Create anchor element for shadow root
      const anchor = document.createElement('div');
      anchor.id = BUTTON_CONTAINER_ID;
      anchor.style.display = 'inline-flex';
      anchor.style.alignItems = 'center';

      // Insert as first child of toolbar
      toolbar.insertBefore(anchor, toolbar.firstChild);

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
    }

    // Remove button if it exists
    function removeButton() {
      const existing = document.getElementById(BUTTON_CONTAINER_ID);
      if (existing) {
        existing.remove();
      }
    }

    // Check if on watch page
    function isWatchPage(): boolean {
      return window.location.pathname === '/watch';
    }

    // Initial injection
    if (isWatchPage()) {
      await injectButton();
    }

    // Handle SPA navigation
    ctx.addEventListener(window, 'wxt:locationchange', async () => {
      if (!ctx.isValid) return;

      // Remove existing button first to prevent duplicates
      removeButton();

      // Only inject on watch pages
      if (isWatchPage()) {
        // Small delay to let YouTube's DOM update
        await new Promise((resolve) => setTimeout(resolve, 100));
        await injectButton();
      }
    });

    console.log('YT-GIF content script loaded');
  },
});
