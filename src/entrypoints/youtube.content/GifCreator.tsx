import { useState, useEffect } from 'react';

export interface GifSettings {
  startTime: number;
  endTime: number;
  fps: number;
  width: number;
}

interface GifCreatorProps {
  videoElement: HTMLVideoElement;
  onCreateGif: (settings: GifSettings) => void;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const mins = parseInt(match[1], 10);
  const secs = parseInt(match[2], 10);
  if (secs >= 60) return null;
  return mins * 60 + secs;
}

export default function GifCreator({ videoElement, onCreateGif, onClose }: GifCreatorProps) {
  const duration = videoElement.duration;
  const currentTime = videoElement.currentTime;

  const [startTimeStr, setStartTimeStr] = useState(() => formatTime(currentTime));
  const [endTimeStr, setEndTimeStr] = useState(() => {
    const endTime = Math.min(currentTime + 3, duration);
    return formatTime(endTime);
  });
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);

    if (startTime === null || endTime === null) {
      setError('Invalid time format. Use MM:SS');
      return;
    }

    if (startTime >= endTime) {
      setError('Start time must be before end time');
      return;
    }

    if (endTime > duration) {
      setError(`End time exceeds video duration (${formatTime(duration)})`);
      return;
    }

    if (startTime < 0) {
      setError('Start time cannot be negative');
      return;
    }

    setError(null);
    onCreateGif({ startTime, endTime, fps, width });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="gif-creator-overlay" onClick={handleOverlayClick}>
      <div className="gif-creator-modal">
        <div className="gif-creator-header">
          <h2 className="gif-creator-title">Create GIF</h2>
          <button className="gif-creator-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="gif-creator-content">
          <div className="gif-creator-info">
            <span className="gif-creator-duration">Video: {formatTime(duration)}</span>
          </div>

          <div className="gif-creator-field">
            <label className="gif-creator-label">Start Time (MM:SS)</label>
            <input
              type="text"
              className="gif-creator-input"
              value={startTimeStr}
              onChange={(e) => setStartTimeStr(e.target.value)}
              placeholder="00:00"
            />
          </div>

          <div className="gif-creator-field">
            <label className="gif-creator-label">End Time (MM:SS)</label>
            <input
              type="text"
              className="gif-creator-input"
              value={endTimeStr}
              onChange={(e) => setEndTimeStr(e.target.value)}
              placeholder="00:03"
            />
          </div>

          <div className="gif-creator-field">
            <label className="gif-creator-label">Frame Rate</label>
            <select
              className="gif-creator-select"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
            >
              <option value={5}>5 FPS (smaller file)</option>
              <option value={10}>10 FPS (balanced)</option>
              <option value={15}>15 FPS (smoother)</option>
            </select>
          </div>

          <div className="gif-creator-field">
            <label className="gif-creator-label">Width</label>
            <select
              className="gif-creator-select"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            >
              <option value={320}>320px (small)</option>
              <option value={480}>480px (medium)</option>
              <option value={640}>640px (large)</option>
            </select>
          </div>

          {error && <div className="gif-creator-error">{error}</div>}
        </div>

        <div className="gif-creator-actions">
          <button className="gif-creator-btn gif-creator-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="gif-creator-btn gif-creator-btn-primary" onClick={handleCreate}>
            Create GIF
          </button>
        </div>
      </div>
    </div>
  );
}
