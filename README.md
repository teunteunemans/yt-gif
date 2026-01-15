# YT-GIF

A browser extension that adds a **GIF** button to YouTube videos, letting you create GIFs directly from any video.

![Chrome](https://img.shields.io/badge/Chrome-Supported-green) ![Firefox](https://img.shields.io/badge/Firefox-Supported-orange)

## Features

- One-click GIF creation from any YouTube video
- Time range selection with frame-level precision
- Adjustable FPS (5/10/15) and width (320/480/640px)
- Draggable modal UI that doesn't block the video
- Click video to set start time
- Instant preview before download
- Works on both Chrome and Firefox

## Installation

### From Stores (Recommended)

- **Chrome Web Store**: Coming soon
- **Firefox Add-ons**: Coming soon

### Manual Installation

1. Download the latest release from [Releases](https://github.com/teunteunemans/yt-gif/releases)
2. **Chrome**: Go to `chrome://extensions`, enable Developer mode, drag the `.zip` file
3. **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select the `.zip` file

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (recommended) or npm

### Setup

```bash
# Clone the repo
git clone https://github.com/teunteunemans/yt-gif.git
cd yt-gif

# Install dependencies
pnpm install
```

### Development Mode

```bash
# Start dev server with hot reload (Chrome)
pnpm dev

# Start dev server for Firefox
pnpm dev -b firefox
```

The extension will auto-reload when you make changes. Load the unpacked extension from `.output/chrome-mv3-dev` or `.output/firefox-mv2-dev`.

### Building

```bash
# Build for Chrome (production)
pnpm build

# Build for Firefox
pnpm build -b firefox
```

Output will be in `.output/chrome-mv3` or `.output/firefox-mv2`.

### Creating Release ZIPs

```bash
# Create distributable ZIP files
pnpm zip         # Chrome
pnpm zip:firefox # Firefox
```

## Tech Stack

- [WXT](https://wxt.dev/) - Next-gen browser extension framework
- [React](https://react.dev/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [gifenc](https://github.com/mattdesl/gifenc) - Fast GIF encoding

## License

MIT License - see [LICENSE](LICENSE)
