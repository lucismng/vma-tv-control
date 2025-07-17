import React from 'react';
import { Channel, EpgProgram, StreamDetails, StreamStatus } from '../../../types';
import { Icon } from '../../../components/ui/Icon';

interface ChannelsListViewProps {
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

export const ChannelsListView: React.FC<ChannelsListViewProps> = ({
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

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, channelId: string) => {
        e.dataTransfer.setData('channelId', channelId);
        e.currentTarget.classList.add('bg-gray-900', 'opacity-50');
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, channelId: string) => {
        e.preventDefault();
        if (channelId !== e.dataTransfer.getData('channelId')) {
             setDragOverId(channelId);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
        setDragOverId(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetChannelId: string) => {
        e.preventDefault();
        const draggedChannelId = e.dataTransfer.getData('channelId');
        if (draggedChannelId && draggedChannelId !== targetChannelId) {
            onReorder(draggedChannelId, targetChannelId);
        }
        setDragOverId(null);
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove('bg-gray-900', 'opacity-50');
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                    <thead className="bg-gray-700 text-xs text-gray-400 uppercase tracking-wider">
                        <tr>
                            {isReordering && <th scope="col" className="px-2 py-3 w-10"></th>}
                            <th scope="col" className="px-4 py-3 w-20">Logo</th>
                            <th scope="col" className="px-4 py-3">Kênh &amp; Thông tin</th>
                            <th scope="col" className="px-4 py-3">Nhóm</th>
                            <th scope="col" className="px-4 py-3 text-center">Trạng thái</th>
                            <th scope="col" className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {channels.map(channel => {
                            const programs = channel.tvgId ? epgData[channel.tvgId] : [];
                            const { currentProgram, nextProgram } = findCurrentAndNextPrograms(programs || []);
                            const details = channel.streamDetails;

                            return (
                                <tr 
                                    key={channel.id} 
                                    draggable={isReordering}
                                    onDragStart={isReordering ? (e) => handleDragStart(e, channel.id) : undefined}
                                    onDragOver={isReordering ? (e) => handleDragOver(e, channel.id) : undefined}
                                    onDragLeave={isReordering ? handleDragLeave : undefined}
                                    onDrop={isReordering ? (e) => handleDrop(e, channel.id) : undefined}
                                    onDragEnd={isReordering ? handleDragEnd : undefined}
                                    className={`transition-colors ${isReordering ? 'cursor-grab' : ''} ${dragOverId === channel.id ? 'bg-primary/20' : 'hover:bg-gray-700/50'}`}
                                >
                                    {isReordering && (
                                        <td className="px-2 py-2 text-center text-gray-500" title="Kéo để sắp xếp">
                                            <Icon name="drag-handle" className="w-5 h-5 inline-block"/>
                                        </td>
                                    )}
                                    <td className="px-4 py-2">
                                        <img src={channel.logo || `https://ui-avatars.com/api/?name=${channel.name}&background=dc2626&color=fff&size=40`} alt="" className="w-10 h-10 object-contain rounded-md bg-gray-900" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${channel.name}&background=dc2626&color=fff&size=40` }} />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-white">{channel.name}</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            <span className="font-semibold text-primary">LIVE:</span> {currentProgram?.title || 'N/A'}
                                        </div>
                                         <div className="text-xs text-gray-500 mt-0.5">
                                            <span className="font-semibold">NEXT:</span> {nextProgram?.title || 'N/A'}
                                        </div>
                                        {details && (details.resolution || details.fps || details.audio) && (
                                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 mt-2">
                                                {details.resolution && details.resolution !== 'YouTube' && <span className="bg-gray-700 px-1.5 py-0.5 rounded">R: {details.resolution}</span>}
                                                {details.fps && <span className="bg-gray-700 px-1.5 py-0.5 rounded">FPS: {details.fps}</span>}
                                                {details.audio && <span className="bg-gray-700 px-1.5 py-0.5 rounded">A: {details.audio}</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{channel.group}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center"><StatusIndicator status={channel.status}/></div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => onCheckStatus(channel.id, channel.url)} className="p-1.5 text-gray-400 hover:text-white" title="Kiểm tra lại"><Icon name="refresh" className="w-4 h-4"/></button>
                                            <button onClick={() => onPlay(channel)} className="p-1.5 text-gray-400 hover:text-white" title="Xem thử"><Icon name="play" className="w-4 h-4"/></button>
                                            <button onClick={() => onEdit(channel)} className="p-1.5 text-gray-400 hover:text-white" title="Sửa"><Icon name="edit" className="w-4 h-4"/></button>
                                            <button onClick={() => onDelete(channel.id)} className="p-1.5 text-gray-400 hover:text-red-400" title="Xóa"><Icon name="trash" className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};