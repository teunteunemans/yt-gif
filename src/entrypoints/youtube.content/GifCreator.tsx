import { useState, useEffect, useRef } from 'react';
import { createGif } from './GifEncoder';

export interface GifSettings {
  startTime: number;
  endTime: number;
  fps: number;
  width: number;
}

interface GifCreatorProps {
  videoElement: HTMLVideoElement;
  onClose: () => void;
}

type EncodingState = 'idle' | 'encoding' | 'complete' | 'error';

function formatTimeForFilename(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m${secs.toString().padStart(2, '0')}s`;
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GifCreator({ videoElement, onClose }: GifCreatorProps) {
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
  const [filename, setFilename] = useState('');

  // Encoding state
  const [encodingState, setEncodingState] = useState<EncodingState>('idle');
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Clean up object URL on unmount or when creating new GIF
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleCreate = async () => {
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
    setEncodingState('encoding');
    setProgress(0);

    // Set default filename based on time range
    const defaultFilename = `yt-gif-${formatTimeForFilename(startTime)}-${formatTimeForFilename(endTime)}`;
    setFilename(defaultFilename);

    // Clean up previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    try {
      const blob = await createGif({
        video: videoElement,
        startTime,
        endTime,
        fps,
        width,
        onProgress: setProgress,
      });
      setResultBlob(blob);
      objectUrlRef.current = URL.createObjectURL(blob);
      setEncodingState('complete');
    } catch (err) {
      console.error('YT-GIF: Encoding failed', err);
      setError(err instanceof Error ? err.message : 'Failed to create GIF');
      setEncodingState('error');
    }
  };

  const handleDownload = () => {
    if (!objectUrlRef.current) return;
    const a = document.createElement('a');
    a.href = objectUrlRef.current;
    // Use custom filename, ensure .gif extension
    const downloadName = filename.endsWith('.gif') ? filename : `${filename}.gif`;
    a.download = downloadName;
    a.click();
  };

  const handleCreateAnother = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setResultBlob(null);
    setEncodingState('idle');
    setProgress(0);
    setError(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && encodingState !== 'encoding') {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && encodingState !== 'encoding') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, encodingState]);

  const isLargeFile = resultBlob && resultBlob.size > 10 * 1024 * 1024;

  return (
    <div className="gif-creator-overlay" onClick={handleOverlayClick}>
      <div className="gif-creator-modal">
        <div className="gif-creator-header">
          <h2 className="gif-creator-title">
            {encodingState === 'complete' ? 'GIF Ready!' : 'Create GIF'}
          </h2>
          {encodingState !== 'encoding' && (
            <button className="gif-creator-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
        </div>

        <div className="gif-creator-content">
          {encodingState === 'idle' && (
            <>
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
            </>
          )}

          {encodingState === 'encoding' && (
            <div className="gif-creator-encoding">
              <div className="gif-creator-progress-label">Encoding... {progress}%</div>
              <div className="gif-creator-progress-bar">
                <div
                  className="gif-creator-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {encodingState === 'complete' && objectUrlRef.current && (
            <div className="gif-creator-preview">
              <img
                src={objectUrlRef.current}
                alt="Generated GIF"
                className="gif-creator-preview-img"
              />
              <div className="gif-creator-preview-info">
                {resultBlob && <span>Size: {formatFileSize(resultBlob.size)}</span>}
              </div>
              <div className="gif-creator-field gif-creator-filename-field">
                <label className="gif-creator-label">Filename</label>
                <input
                  type="text"
                  className="gif-creator-input"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="yt-gif"
                />
              </div>
              {isLargeFile && (
                <div className="gif-creator-warning">
                  Large file! Consider shorter duration or lower settings.
                </div>
              )}
            </div>
          )}

          {(error || encodingState === 'error') && (
            <div className="gif-creator-error">{error || 'An error occurred'}</div>
          )}
        </div>

        <div className="gif-creator-actions">
          {encodingState === 'idle' && (
            <>
              <button className="gif-creator-btn gif-creator-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="gif-creator-btn gif-creator-btn-primary" onClick={handleCreate}>
                Create GIF
              </button>
            </>
          )}

          {encodingState === 'encoding' && (
            <span className="gif-creator-encoding-note">Please wait...</span>
          )}

          {encodingState === 'complete' && (
            <>
              <button
                className="gif-creator-btn gif-creator-btn-secondary"
                onClick={handleCreateAnother}
              >
                Create Another
              </button>
              <button
                className="gif-creator-btn gif-creator-btn-download"
                onClick={handleDownload}
              >
                Download GIF
              </button>
            </>
          )}

          {encodingState === 'error' && (
            <>
              <button className="gif-creator-btn gif-creator-btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                className="gif-creator-btn gif-creator-btn-primary"
                onClick={handleCreateAnother}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
