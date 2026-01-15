import { useEffect, useState } from 'react';

function App() {
  const [isOnYoutube, setIsOnYoutube] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we're on a YouTube video page
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const tab = tabs[0];
      setIsOnYoutube(!!tab?.url?.includes('youtube.com/watch'));
    });
  }, []);

  return (
    <div style={{ padding: '16px', minWidth: '260px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>YT-GIF</h1>

      {isOnYoutube === null && (
        <p style={{ color: '#666' }}>Loading...</p>
      )}

      {isOnYoutube === true && (
        <div>
          <p style={{ marginBottom: '12px', color: '#fff', lineHeight: '1.5' }}>
            Click the <strong style={{ color: '#ff0000' }}>GIF</strong> button next to the Like button to create a GIF.
          </p>
          <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.4' }}>
            The button is in the video toolbar, below the video player.
          </p>
        </div>
      )}

      {isOnYoutube === false && (
        <div>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            Navigate to a YouTube video to create GIFs.
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Open any YouTube video, then look for the GIF button in the toolbar.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
