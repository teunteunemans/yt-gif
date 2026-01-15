import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '16px', minWidth: '200px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>YT-GIF</h1>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Create GIFs from YouTube videos
      </p>
      <button
        onClick={() => setCount((count) => count + 1)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Count: {count}
      </button>
    </div>
  );
}

export default App;
