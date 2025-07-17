import React from 'react';
import { MediaPlayer } from './MediaPlayer';

interface EmbeddedVideoPlayerProps {
  streamUrl: string;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({ streamUrl }) => {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {streamUrl ? (
        <MediaPlayer streamUrl={streamUrl} />
      ) : (
        <div className="text-gray-500">Kênh không có URL hợp lệ.</div>
      )}
    </div>
  );
};
