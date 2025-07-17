import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import { MediaPlayer } from './MediaPlayer';

interface VideoPlayerModalProps {
  streamUrl: string;
  channelName: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ streamUrl, channelName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl relative flex flex-col overflow-hidden border border-gray-700/50" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center p-3 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="text-md font-medium text-gray-200 text-center flex-1 mx-4 truncate">{channelName}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <Icon name="close" />
            </button>
        </header>
        <div className="flex-1 bg-black w-full aspect-video">
            <MediaPlayer streamUrl={streamUrl} />
        </div>
      </div>
    </div>
  );
};