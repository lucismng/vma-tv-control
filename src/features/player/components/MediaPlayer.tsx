import React from 'react';
import videojs from 'video.js';
import 'videojs-youtube'; // Đăng ký tech YouTube cho Video.js

interface MediaPlayerProps {
  streamUrl: string;
}

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ streamUrl }) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<videojs.Player | null>(null);

  React.useEffect(() => {
    // Chỉ khởi tạo player một lần
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      
      playerRef.current = videojs(videoElement, {
        autoplay: true,
        muted: true,
        controls: true,
        responsive: true,
        fluid: true,
      });
    }
    
    // Hủy player khi component bị unmount
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []); // Mảng rỗng đảm bảo effect này chỉ chạy khi mount và unmount

  // Effect để cập nhật source khi streamUrl thay đổi
  React.useEffect(() => {
    const player = playerRef.current;
    if (player && streamUrl) {
        const isYoutube = YOUTUBE_REGEX.test(streamUrl);
        const isHls = streamUrl.includes('.m3u8');
        let source: { src: string; type?: string; };

        if (isYoutube) {
            // Video.js sẽ tự động sử dụng tech 'youtube' đã được import
            source = { type: 'video/youtube', src: streamUrl };
        } else if (isHls) {
            source = { type: 'application/x-mpegURL', src: streamUrl };
        } else {
            // Cho các định dạng khác như mp4
            source = { src: streamUrl };
        }
        player.src(source);
    }
  }, [streamUrl]);

  return (
    <div data-vjs-player className="w-full h-full bg-black">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
};
