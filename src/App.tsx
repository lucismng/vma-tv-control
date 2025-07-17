
import React from 'react';
import { Channel, Group, StreamStatus, EpgProgram, EpgSource } from './types';
import { ChannelModal } from './features/channels/components/ChannelModal';
import { Icon } from './components/ui/Icon';
import { parseM3U, generateM3U } from './services/m3uService';
import { checkStreamStatus } from './services/streamCheckService';
import { VideoPlayerModal } from './features/player/components/VideoPlayerModal';
import { GroupManagerView } from './features/groups/components/GroupManagerView';
import { ImportM3uModal } from './features/channels/components/ImportM3uModal';
import { SettingsModal } from './features/settings/components/SettingsModal';
import { EpgView } from './features/epg/components/EpgView';
import { fetchAllEpgData } from './services/epgService';
import { Sidebar } from './components/layout/Sidebar';
import { ChannelsGridView } from './features/channels/components/ChannelsGridView';
import { ChannelsListView } from './features/channels/components/ChannelsListView';
import { Header } from './components/layout/Header';

type ViewMode = 'CHANNELS' | 'GROUPS' | 'EPG';
export type LayoutMode = 'grid' | 'list';
export type EpgLoadingStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

const App: React.FC = () => {
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [epgSources, setEpgSources] = React.useState<EpgSource[]>([]);
  const [epgData, setEpgData] = React.useState<Record<string, EpgProgram[]>>({});
  const [epgLoadingStatus, setEpgLoadingStatus] = React.useState<EpgLoadingStatus>('IDLE');
  const [epgError, setEpgError] = React.useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<string>('Tất cả');
  const [isChannelModalOpen, setIsChannelModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [channelToEdit, setChannelToEdit] = React.useState<Channel | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('CHANNELS');
  const [layoutMode, setLayoutMode] = React.useState<LayoutMode>('grid');
  const [playingChannel, setPlayingChannel] = React.useState<Channel | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isReordering, setIsReordering] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update time every minute for EPG refresh
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    try {
        const savedChannels = localStorage.getItem('tv_channels');
        const savedGroups = localStorage.getItem('tv_groups');
        const savedEpgSources = localStorage.getItem('tv_epg_sources');
        const savedLayoutMode = localStorage.getItem('tv_layout_mode') as LayoutMode;
        
        let loadedChannels: Channel[] = savedChannels ? JSON.parse(savedChannels) : [];
        // Ensure order property exists and sort channels
        loadedChannels = loadedChannels
            .map((ch, index) => ({ ...ch, order: ch.order ?? index }))
            .sort((a, b) => a.order - b.order);

        setChannels(loadedChannels);
        setGroups(savedGroups ? JSON.parse(savedGroups) : []);
        setEpgSources(savedEpgSources ? JSON.parse(savedEpgSources) : []);
        setLayoutMode(savedLayoutMode || 'grid');
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        setChannels([]);
        setGroups([]);
        setEpgSources([]);
        setLayoutMode('grid');
    }
  }, []);

  React.useEffect(() => {
    try {
        localStorage.setItem('tv_channels', JSON.stringify(channels));
        localStorage.setItem('tv_groups', JSON.stringify(groups));
        localStorage.setItem('tv_epg_sources', JSON.stringify(epgSources));
        localStorage.setItem('tv_layout_mode', layoutMode);
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [channels, groups, epgSources, layoutMode]);

  React.useEffect(() => {
    if (epgSources && epgSources.length > 0) {
      const loadEpg = async () => {
        setEpgLoadingStatus('LOADING');
        setEpgError(null);
        setEpgData({}); // Clear old data
        try {
          const urls = epgSources.map(s => s.url);
          const { mergedData, errors } = await fetchAllEpgData(urls);
          setEpgData(mergedData);
          setEpgLoadingStatus('SUCCESS');
          if (errors.length > 0) {
            setEpgError(`Không thể tải EPG từ ${errors.length} nguồn.`);
          }
        } catch (e) {
          console.error("Failed to load EPG data in App component", e);
          const errorMessage = e instanceof Error ? e.message : 'Lỗi không xác định khi tải EPG.';
          setEpgError(errorMessage);
          setEpgData({});
          setEpgLoadingStatus('ERROR');
        }
      };
      loadEpg();
    } else {
        setEpgData({});
        setEpgLoadingStatus('IDLE');
        setEpgError(null);
    }
  }, [epgSources]);
  
  const handleSaveChannel = (channelData: Omit<Channel, 'status' | 'streamDetails' | 'order'>) => {
    const existingChannel = channels.find(c => c.id === channelData.id);
    let newChannels;

    if (existingChannel) {
        newChannels = channels.map(c => c.id === channelData.id ? { ...c, ...channelData } : c);
    } else {
        const newChannel: Channel = {
            ...channelData,
            order: channels.length,
            status: StreamStatus.IDLE,
            streamDetails: undefined
        };
        newChannels = [...channels, newChannel];
        checkAndUpdateStatus(newChannel.id, newChannel.url);
    }
    
    setChannels(newChannels);
    
    if (!groups.some(g => g.name === 'Uncategorized')) {
        setGroups([...groups, { id: `grp-uncategorized`, name: 'Uncategorized' }]);
    }
  };

  const handleEditChannel = (channel: Channel) => {
    setChannelToEdit(channel);
    setIsChannelModalOpen(true);
  };
  
  const handleDeleteChannel = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa kênh này?')) {
        setChannels(channels.filter(c => c.id !== id));
    }
  };
  
  const checkAndUpdateStatus = React.useCallback(async (channelId: string, url: string) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, status: StreamStatus.CHECKING } : c));
    const { status, details } = await checkStreamStatus(url);
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, status, streamDetails: details ?? undefined } : c));
  }, []);

  const handleM3uContentImport = (content: string) => {
    const importedChannels = parseM3U(content);
    if(importedChannels.length === 0) {
        alert("Không tìm thấy kênh nào trong file hoặc link được cung cấp.");
        return;
    }

    const newChannels = importedChannels.map((ch, index) => ({
        ...ch,
        id: ch.id || `ch-${Date.now()}-${Math.random()}`,
        status: StreamStatus.IDLE,
        order: channels.length + index,
    } as Channel));

    setChannels(prev => [...prev, ...newChannels]);
    
    const currentGroups = new Set(groups.map(g => g.name));
    const newGroupsToCreate = new Set<string>();

    importedChannels.forEach(ch => {
        if (ch.group && !currentGroups.has(ch.group)) {
            newGroupsToCreate.add(ch.group);
        }
    });

    if (!currentGroups.has('Uncategorized')) {
        newGroupsToCreate.add('Uncategorized');
    }

    const newGroups = [...groups, ...Array.from(newGroupsToCreate).map(name => ({ id: `grp-${Date.now()}-${name}`, name }))];
    setGroups(newGroups);

    alert(`${importedChannels.length} kênh đã được nhập.`);
    newChannels.forEach(ch => checkAndUpdateStatus(ch.id, ch.url));
  };

  const handleExportM3U = () => {
    const epgUrls = epgSources.map(s => s.url);
    const m3uContent = generateM3U(channels, epgUrls);
    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_tv_channels.m3u';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReorderChannels = (draggedChannelId: string, targetChannelId: string) => {
    if (draggedChannelId === targetChannelId) return;

    setChannels(prevChannels => {
        const draggedIndex = prevChannels.findIndex(c => c.id === draggedChannelId);
        const targetIndex = prevChannels.findIndex(c => c.id === targetChannelId);

        if (draggedIndex === -1 || targetIndex === -1) return prevChannels;

        const newOrderedChannels = Array.from(prevChannels);
        const [draggedItem] = newOrderedChannels.splice(draggedIndex, 1);
        newOrderedChannels.splice(targetIndex, 0, draggedItem);
        
        return newOrderedChannels.map((ch, index) => ({ ...ch, order: index }));
    });
  };

  const filteredChannels = React.useMemo(() => {
    const baseChannels = selectedGroup === 'Tất cả' ? channels : channels.filter(c => c.group === selectedGroup);
    return baseChannels.sort((a, b) => a.order - b.order);
  }, [channels, selectedGroup]);
  
  const findCurrentAndNextPrograms = React.useCallback((programs: EpgProgram[]) => {
    if (!programs || programs.length === 0) return { currentProgram: null, nextProgram: null };
    
    let currentProgram: EpgProgram | null = null;
    let nextProgram: EpgProgram | null = null;

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        if (currentTime >= program.start && currentTime < program.end) {
            currentProgram = program;
            if (i + 1 < programs.length) {
                nextProgram = programs[i + 1];
            }
            break; 
        }
    }
    
    if (!currentProgram) {
        nextProgram = programs.find(p => p.start > currentTime) || null;
    }

    return { currentProgram, nextProgram };
  }, [currentTime]);

  const getHeaderTitle = () => {
      switch(viewMode) {
          case 'GROUPS': return 'Quản lý Nhóm';
          case 'EPG': return 'Lịch Phát Sóng & TV';
          case 'CHANNELS': return `Nhóm: ${selectedGroup}`;
          default: return 'VMA TV Control';
      }
  }
  
  return (
    <div className="flex h-screen bg-gray-900">
      <ChannelModal 
        isOpen={isChannelModalOpen} 
        onClose={() => { setIsChannelModalOpen(false); setChannelToEdit(null); }} 
        onSave={handleSaveChannel} 
        channelToEdit={channelToEdit} 
      />
      <ImportM3uModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleM3uContentImport} 
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        epgSources={epgSources} 
        onSaveEpgSources={setEpgSources}
      />
      {playingChannel && 
        <VideoPlayerModal 
          streamUrl={playingChannel.url} 
          channelName={playingChannel.name} 
          onClose={() => setPlayingChannel(null)} 
        />}
      
      <Sidebar 
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        viewMode={viewMode}
        setViewMode={setViewMode}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={getHeaderTitle()}
            onAddChannel={() => { setIsChannelModalOpen(true); setChannelToEdit(null); }}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExportM3U}
            isReordering={isReordering}
            setIsReordering={setIsReordering}
            viewMode={viewMode}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {viewMode === 'CHANNELS' && (
            <>
                {channels.length > 0 ? (
                    layoutMode === 'grid' ? 
                    <ChannelsGridView 
                        channels={filteredChannels}
                        epgData={epgData}
                        findCurrentAndNextPrograms={findCurrentAndNextPrograms}
                        onCheckStatus={checkAndUpdateStatus}
                        onPlay={setPlayingChannel}
                        onEdit={handleEditChannel}
                        onDelete={handleDeleteChannel}
                        isReordering={isReordering}
                        onReorder={handleReorderChannels}
                    /> 
                    : <ChannelsListView 
                        channels={filteredChannels}
                        epgData={epgData}
                        findCurrentAndNextPrograms={findCurrentAndNextPrograms}
                        onCheckStatus={checkAndUpdateStatus}
                        onPlay={setPlayingChannel}
                        onEdit={handleEditChannel}
                        onDelete={handleDeleteChannel}
                        isReordering={isReordering}
                        onReorder={handleReorderChannels}
                    />
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        <Icon name="tv" className="w-16 h-16 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold">Chưa có kênh nào</h3>
                        <p className="mt-2">Hãy bắt đầu bằng cách thêm kênh mới hoặc import từ file M3U.</p>
                    </div>
                )}
            </>
          )}
          {viewMode === 'GROUPS' && <GroupManagerView groups={groups} channels={channels} setGroups={setGroups} setChannels={setChannels} />}
          {viewMode === 'EPG' && <EpgView channels={channels} epgData={epgData} epgLoadingStatus={epgLoadingStatus} epgError={epgError} />}
        </main>
      </div>
    </div>
  );
};

export default App;
