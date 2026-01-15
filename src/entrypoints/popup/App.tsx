import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState<'loading' | 'success' | 'not-youtube'>('loading');

  useEffect(() => {
    // Send message to content script to open GIF creator
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const tab = tabs[0];
      if (!tab?.id || !tab.url?.includes('youtube.com/watch')) {
        setStatus('not-youtube');
        return;
      }

      browser.tabs.sendMessage(tab.id, { action: 'openGifCreator' })
        .then(() => {
          setStatus('success');
          // Close popup after a brief moment
          setTimeout(() => window.close(), 300);
        })
        .catch((err) => {
          console.log('Cannot open GIF creator:', err);
          setStatus('not-youtube');
        });
    });
  }, []);

  return (
    <div style={{ padding: '16px', minWidth: '220px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>YT-GIF</h1>
      {status === 'loading' && (
        <p style={{ color: '#666' }}>Opening GIF creator...</p>
      )}
      {status === 'success' && (
        <p style={{ color: '#4caf50' }}>GIF creator opened!</p>
      )}
      {status === 'not-youtube' && (
        <div>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            Navigate to a YouTube video to create GIFs.
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Open any YouTube video, then click this icon to start.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
