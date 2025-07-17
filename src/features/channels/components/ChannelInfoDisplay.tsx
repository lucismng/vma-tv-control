import React from 'react';
import { Channel, EpgProgram } from '../../../types';

interface ChannelInfoDisplayProps {
    channel: Channel;
    epgData: Record<string, EpgProgram[]>;
    findCurrentAndNextPrograms: (programs: EpgProgram[]) => { currentProgram: EpgProgram | null; nextProgram: EpgProgram | null; };
}

export const ChannelInfoDisplay: React.FC<ChannelInfoDisplayProps> = React.memo(({channel, epgData, findCurrentAndNextPrograms}) => {
    const programs = channel.tvgId ? epgData[channel.tvgId] : [];
    const { currentProgram, nextProgram } = findCurrentAndNextPrograms(programs || []);
    const details = channel.streamDetails;

    return (
        <div className="space-y-3">
            {/* EPG Info */}
            <div>
                <p className="text-xs text-gray-500 mb-0.5">Đang phát</p>
                <p className="text-sm text-gray-300 leading-snug truncate" title={currentProgram?.title}>{currentProgram?.title || 'Không có thông tin'}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500 mb-0.5">Tiếp theo</p>
                <p className="text-sm text-gray-400 leading-snug truncate" title={nextProgram?.title}>{nextProgram?.title || 'Không có thông tin'}</p>
            </div>
            
            {/* Stream Details */}
            {details && (details.resolution || details.fps || details.audio) && (
                <div className="pt-3 border-t border-gray-700/50">
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
                        {details.resolution && details.resolution !== 'YouTube' && <span className="bg-gray-700 px-1.5 py-0.5 rounded">R: {details.resolution}</span>}
                        {details.fps && <span className="bg-gray-700 px-1.5 py-0.5 rounded">FPS: {details.fps}</span>}
                        {details.audio && <span className="bg-gray-700 px-1.5 py-0.5 rounded">A: {details.audio}</span>}
                    </div>
                </div>
            )}
        </div>
    );
});
ChannelInfoDisplay.displayName = 'ChannelInfoDisplay';
