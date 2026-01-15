import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export interface GifEncoderOptions {
  video: HTMLVideoElement;
  startTime: number;
  endTime: number;
  fps: number;
  width: number;
  onProgress?: (percent: number) => void;
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}

export async function createGif(options: GifEncoderOptions): Promise<Blob> {
  const { video, startTime, endTime, fps, width, onProgress } = options;

  // Calculate dimensions maintaining aspect ratio
  const aspectRatio = video.videoHeight / video.videoWidth;
  const height = Math.round(width * aspectRatio);

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Calculate frame timing
  const duration = endTime - startTime;
  const totalFrames = Math.ceil(duration * fps);
  const frameDelay = Math.round(100 / fps); // gifenc uses centiseconds (1/100 sec)

  // Create GIF encoder
  const gif = GIFEncoder();

  // Capture frames
  for (let i = 0; i < totalFrames; i++) {
    const frameTime = startTime + (i / fps);

    // Seek to frame time
    await seekVideo(video, frameTime);

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    // Quantize to 256 colors
    const palette = quantize(data, 256);

    // Apply palette to get indexed pixels
    const indexed = applyPalette(data, palette);

    // Write frame
    gif.writeFrame(indexed, width, height, {
      palette,
      delay: frameDelay,
    });

    // Report progress
    if (onProgress) {
      const percent = Math.round(((i + 1) / totalFrames) * 100);
      onProgress(percent);
    }
  }

  // Finish encoding
  gif.finish();

  // Return as Blob
  const bytes = gif.bytes();
  return new Blob([bytes], { type: 'image/gif' });
}
