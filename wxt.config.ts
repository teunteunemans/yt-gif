import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'YT-GIF',
    version: '0.1.0',
    description:
      'Create animated GIFs from any YouTube video. Select your time range, adjust quality, and download instantly.',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['*://*.youtube.com/*'],
    icons: {
      16: 'assets/icon-16.png',
      32: 'assets/icon-32.png',
      48: 'assets/icon-48.png',
      96: 'assets/icon-96.png',
      128: 'assets/icon-128.png',
    },
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'yt-gif@kijkte.dev',
          strict_min_version: '142.0',
          data_collection_permissions: {
            required: [],
          },
        },
      },
    }),
  }),
});
