import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'YT-GIF',
    version: '0.1.0',
    description: 'Create GIFs from YouTube videos',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['*://*.youtube.com/*'],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'yt-gif@example.com',
          strict_min_version: '109.0',
        },
      },
    }),
  }),
});
