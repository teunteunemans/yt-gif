import { useState, useEffect, useCallback } from 'react';
import './style.css';
import GifCreator from './GifCreator';

export default function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const handleClick = useCallback(() => {
    const video = document.querySelector('video.html5-main-video') as HTMLVideoElement | null;
    if (!video) {
      console.warn('YT-GIF: Video element not found');
      return;
    }
    setVideoElement(video);
    setShowCreator(true);
  }, []);

  const handleClose = () => {
    setShowCreator(false);
    setVideoElement(null);
  };

  // Listen for messages from popup to open GIF creator
  useEffect(() => {
    const handleMessage = (message: { action: string }) => {
      if (message.action === 'openGifCreator') {
        handleClick();
      }
    };
    browser.runtime.onMessage.addListener(handleMessage);
    return () => browser.runtime.onMessage.removeListener(handleMessage);
  }, [handleClick]);

  return (
    <>
      <button className="yt-gif-button" onClick={handleClick} title="Create GIF from video">
        <svg className="yt-gif-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M11.5 9H13v6h-1.5V9zM9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1zm10 1.5V9h-4.5v6H16v-2h2v-1.5h-2v-1h3z"/>
        </svg>
        <span className="yt-gif-label">GIF</span>
      </button>
      {showCreator && videoElement && (
        <GifCreator
          videoElement={videoElement}
          onClose={handleClose}
        />
      )}
    </>
  );
}
