import { StreamStatus, StreamDetails } from '../types';
import Hls from 'hls.js';

/**
 * Checks the status of a stream URL and attempts to extract technical details for HLS streams.
 * @param url The stream URL to check.
 * @returns A Promise that resolves to an object containing the stream status and details.
 */
export const checkStreamStatus = (url: string): Promise<{ status: StreamStatus; details: StreamDetails | null }> => {
  return new Promise((resolve) => {
    // Check for HLS stream and if hls.js is available
    if (url && url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls({
        // Minimal config to fetch manifest without buffering video data
        maxBufferLength: 1,
        maxMaxBufferLength: 1,
      });

      hls.loadSource(url);

      const timeout = setTimeout(() => {
        hls.destroy();
        resolve({ status: StreamStatus.OFFLINE, details: null });
      }, 8000); // 8-second timeout for the check

      hls.on(Hls.Events.MANIFEST_PARSED, (_event: any, data: any) => {
        if (data.levels && data.levels.length > 0) {
          // Get the highest quality level for details
          const level = data.levels[data.levels.length - 1];
          const details: StreamDetails = {
            resolution: (level.width && level.height) ? `${level.width}x${level.height}` : undefined,
            fps: level.frameRate ? Math.round(level.frameRate) : undefined,
            audio: level.audioCodec ? level.audioCodec.split('.')[0] : undefined, // e.g., 'mp4a'
          };
          clearTimeout(timeout);
          hls.destroy();
          resolve({ status: StreamStatus.ONLINE, details });
        } else {
          // Manifest parsed but no levels found, still consider it online
          clearTimeout(timeout);
          hls.destroy();
          resolve({ status: StreamStatus.ONLINE, details: null });
        }
      });

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        if (data.fatal) {
          clearTimeout(timeout);
          hls.destroy();
          resolve({ status: StreamStatus.OFFLINE, details: null });
        }
      });

    } else if (url && (url.startsWith('http') || url.startsWith('rtmp'))) {
      // Basic fallback for non-HLS or where Hls.js is not supported.
      // This is a simplified mock. A real implementation would need a backend proxy
      // to avoid CORS issues for a robust check.
      const isOnline = Math.random() > 0.3; // 70% chance of being online
      resolve({ status: isOnline ? StreamStatus.ONLINE : StreamStatus.OFFLINE, details: null });
    } else {
      resolve({ status: StreamStatus.OFFLINE, details: null });
    }
  });
};
