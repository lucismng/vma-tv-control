import React from 'react';
import { Channel, EpgProgram, StreamStatus } from '../../../types';
import { ChannelInfoDisplay } from './ChannelInfoDisplay';
import { Icon } from '../../../components/ui/Icon';

interface ChannelsGridViewProps {
    channels: Channel[];
    epgData: Record<string, EpgProgram[]>;
    findCurrentAndNextPrograms: (programs: EpgProgram[]) => { currentProgram: EpgProgram | null; nextProgram: EpgProgram | null; };
    onCheckStatus: (channelId: string, url: string) => void;
    onPlay: (channel: Channel) => void;
    onEdit: (channel: Channel) => void;
    onDelete: (channelId: string) => void;
    isReordering: boolean;
    onReorder: (draggedId: string, targetId: string) => void;
}

const StatusIndicator: React.FC<{ status: StreamStatus }> = React.memo(({ status }) => {
    switch (status) {
      case StreamStatus.ONLINE:
        return <div className="w-3 h-3 bg-green-500 rounded-full" title="Hoạt động"></div>;
      case StreamStatus.OFFLINE:
        return <div className="w-3 h-3 bg-red-500 rounded-full" title="Lỗi"></div>;
      case StreamStatus.CHECKING:
        return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title="Đang kiểm tra"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full" title="Chưa kiểm tra"></div>;
    }
});
StatusIndicator.displayName = 'StatusIndicator';


export const ChannelsGridView: React.FC<ChannelsGridViewProps> = ({
    channels,
    epgData,
    findCurrentAndNextPrograms,
    onCheckStatus,
    onPlay,
    onEdit,
    onDelete,
    isReordering,
    onReorder
}) => {
    const [dragOverId, setDragOverId] = React.useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, channelId: string) => {
        e.dataTransfer.setData('channelId', channelId);
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, channelId: string) => {
        e.preventDefault();
        setDragOverId(channelId);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOverId(null);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetChannelId: string) => {
        e.preventDefault();
        const draggedChannelId = e.dataTransfer.getData('channelId');
        if (draggedChannelId && draggedChannelId !== targetChannelId) {
            onReorder(draggedChannelId, targetChannelId);
        }
        setDragOverId(null);
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');
    }
    
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {channels.map(channel => (
        <div 
            key={channel.id}
            draggable={isReordering}
            onDragStart={isReordering ? (e) => handleDragStart(e, channel.id) : undefined}
            onDragOver={isReordering ? (e) => handleDragOver(e, channel.id) : undefined}
            onDragLeave={isReordering ? handleDragLeave : undefined}
            onDrop={isReordering ? (e) => handleDrop(e, channel.id) : undefined}
            onDragEnd={isReordering ? handleDragEnd : undefined}
            className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-200 ${
                isReordering ? 'cursor-grab' : ''
            } ${dragOverId === channel.id ? 'ring-2 ring-primary ring-inset' : ''}`}
        >
            <div className="relative p-3 flex items-center space-x-4 border-b border-gray-700">
                {isReordering && (
                    <div className="text-gray-500 cursor-grab" title="Kéo để sắp xếp">
                        <Icon name="drag-handle" className="w-5 h-5"/>
                    </div>
                )}
                <img src={channel.logo || `https://ui-avatars.com/api/?name=${channel.name}&background=dc2626&color=fff`} alt={`${channel.name} logo`} className="w-12 h-12 object-contain bg-gray-700 rounded-md flex-shrink-0" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${channel.name}&background=dc2626&color=fff` }} />
                <div className="flex-1 min-w-0">
                    <h3 className="text-md font-bold text-white truncate">{channel.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{channel.group}</p>
                </div>
                <StatusIndicator status={channel.status}/>
            </div>
            <div className="p-3 flex-grow">
              <ChannelInfoDisplay 
                channel={channel} 
                epgData={epgData}
                findCurrentAndNextPrograms={findCurrentAndNextPrograms}
              />
            </div>
            <div className="p-2 bg-gray-700/50 flex justify-end space-x-2">
                <button onClick={() => onCheckStatus(channel.id, channel.url)} className="p-2 text-gray-400 hover:text-white" title="Kiểm tra lại"><Icon name="refresh" className="w-5 h-5"/></button>
                <button onClick={() => onPlay(channel)} className="p-2 text-gray-400 hover:text-white" title="Xem thử"><Icon name="play" className="w-5 h-5"/></button>
                <button onClick={() => onEdit(channel)} className="p-2 text-gray-400 hover:text-white" title="Sửa"><Icon name="edit" className="w-5 h-5"/></button>
                <button onClick={() => onDelete(channel.id)} className="p-2 text-gray-400 hover:text-red-400" title="Xóa"><Icon name="trash" className="w-5 h-5"/></button>
            </div>
        </div>
      ))}
    </div>
);
}