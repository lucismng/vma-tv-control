import React from 'react';
import { Channel, EpgProgram } from '../../../types';
import { Icon } from '../../../components/ui/Icon';
import { EmbeddedVideoPlayer } from '../../player/components/EmbeddedVideoPlayer';
import { EpgLoadingStatus } from '../../../App';

interface ProgramScheduleViewProps {
  programs: EpgProgram[];
  channelName: string;
  liveProgramIndex: number;
}

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ProgramScheduleView: React.FC<ProgramScheduleViewProps> = ({ programs, channelName, liveProgramIndex }) => {
  const liveProgramRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    // Scroll the live program into view when the component mounts or channel changes
    if (liveProgramRef.current) {
      liveProgramRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [liveProgramIndex, channelName]);

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-bold text-white truncate" title={`Lịch phát sóng: ${channelName}`}>
          Lịch phát sóng: <span className="text-primary">{channelName}</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {programs.length > 0 ? (
          <ul className="divide-y divide-gray-700/50">
            {programs.map((program, index) => {
              const isLive = index === liveProgramIndex;
              const hasPassed = program.end < new Date();
              
              return (
                <li 
                  key={`${program.title}-${program.start.toISOString()}`} 
                  ref={isLive ? liveProgramRef : null}
                  className={`p-3 transition-colors ${
                    isLive ? 'bg-primary/20 border-l-4 border-primary' : ''
                  }`}
                >
                  <div className={`flex space-x-4 ${isLive ? '' : hasPassed ? 'opacity-50' : ''}`}>
                    <div className="text-right flex-shrink-0 w-24">
                        <p className={`font-semibold ${isLive ? 'text-primary' : 'text-gray-300'}`}>{formatTime(program.start)}</p>
                        <p className="text-xs text-gray-400">đến {formatTime(program.end)}</p>
                    </div>
                    <div>
                        <p className={`font-medium ${isLive ? 'text-white' : 'text-gray-200'}`}>{program.title}</p>
                        {program.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{program.description}</p>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
            <p>Không có lịch phát sóng cho kênh này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface EpgViewProps {
  channels: Channel[];
  epgData: Record<string, EpgProgram[]>;
  epgLoadingStatus: EpgLoadingStatus;
  epgError: string | null;
}

export const EpgView: React.FC<EpgViewProps> = ({ channels, epgData, epgLoadingStatus, epgError }) => {
  const [selectedChannelId, setSelectedChannelId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentTime, setCurrentTime] = React.useState(new Date());

   React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update time every minute
    return () => clearInterval(timer);
  }, []);

  const channelsWithTvgId = React.useMemo(() => {
    return channels
      .filter(c => c.tvgId)
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [channels, searchTerm]);
  
  React.useEffect(() => {
    if(!selectedChannelId && channelsWithTvgId.length > 0) {
        setSelectedChannelId(channelsWithTvgId[0].id);
    }
  }, [channelsWithTvgId, selectedChannelId]);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const programsForSelectedChannel = selectedChannel?.tvgId ? epgData[selectedChannel.tvgId] || [] : [];
  
  const { liveProgramIndex, nextProgramIndex } = React.useMemo(() => {
    if (!programsForSelectedChannel || programsForSelectedChannel.length === 0) {
        return { liveProgramIndex: -1, nextProgramIndex: -1 };
    }
    
    const liveIdx = programsForSelectedChannel.findIndex(p => currentTime >= p.start && currentTime < p.end);
    let nextIdx = -1;
    
    if (liveIdx !== -1) {
      nextIdx = liveIdx + 1 < programsForSelectedChannel.length ? liveIdx + 1 : -1;
    } else {
      nextIdx = programsForSelectedChannel.findIndex(p => p.start > currentTime);
    }
    
    return { liveProgramIndex: liveIdx, nextProgramIndex: nextIdx };
  }, [programsForSelectedChannel, currentTime]);
  
  const currentProgram = liveProgramIndex !== -1 ? programsForSelectedChannel[liveProgramIndex] : null;
  const nextProgram = nextProgramIndex !== -1 ? programsForSelectedChannel[nextProgramIndex] : null;
  const streamDetails = selectedChannel?.streamDetails;

  if (epgLoadingStatus === 'LOADING') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-800 rounded-lg">
        <Icon name="spinner" className="w-12 h-12 mb-4" />
        <p className="text-lg">Đang tải dữ liệu EPG...</p>
      </div>
    );
  }

  if (epgLoadingStatus === 'ERROR' || Object.keys(epgData).length === 0) {
      const title = epgLoadingStatus === 'ERROR' ? "Không thể tải Lịch Phát Sóng" : "Chưa có nguồn EPG";
      const message = epgError || "Nguồn EPG chưa được thiết lập hoặc không có dữ liệu. Vui lòng vào Cài đặt để thêm URL XMLTV.";
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 bg-red-900/20 rounded-lg p-8">
        <Icon name="error" className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-center">{message}</p>
      </div>
    );
  }
    
  return (
    <div className="flex h-full bg-gray-900 rounded-lg overflow-hidden">
        {/* Left Column: Channel List */}
        <div className="w-[25%] bg-gray-800 border-r border-gray-700/50 flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm kênh..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:ring-primary focus:border-primary"
                />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {channelsWithTvgId.length > 0 ? channelsWithTvgId.map(channel => (
                <div
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    className={`flex items-center space-x-3 p-3 cursor-pointer border-l-4 transition-colors ${selectedChannelId === channel.id ? 'bg-primary border-primary' : 'border-transparent hover:bg-gray-700/50'}`}
                >
                    <img src={channel.logo || `https://ui-avatars.com/api/?name=${channel.name}&background=404040&color=fff&size=40`} alt="" className="w-10 h-10 object-contain rounded-md bg-gray-900 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${selectedChannelId === channel.id ? 'text-white' : 'text-gray-200'}`}>{channel.name}</p>
                        <p className={`text-xs truncate ${selectedChannelId === channel.id ? 'text-red-200' : 'text-gray-400'}`}>{channel.tvgId}</p>
                    </div>
                </div>
                )) : (
                    <div className="text-center text-gray-500 p-6">
                        <p>{searchTerm ? 'Không tìm thấy kênh nào khớp' : 'Không có kênh nào có TVG ID'}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Middle Column: Program Schedule */}
        <div className="w-[35%] border-r border-gray-700/50 flex flex-col">
          {selectedChannel ? (
            <ProgramScheduleView 
              programs={programsForSelectedChannel}
              channelName={selectedChannel.name}
              liveProgramIndex={liveProgramIndex}
            />
          ) : (
             <div className="flex items-center justify-center h-full text-gray-500">
                <p>Chọn một kênh để xem lịch phát sóng.</p>
            </div>
          )}
        </div>


        {/* Right Column: Video Player + Info Panel */}
        <div className="w-[40%] flex flex-col bg-black">
            {/* Video Player Area */}
            <div className="w-full h-2/3 relative bg-black">
                {selectedChannel ? (
                    <EmbeddedVideoPlayer key={selectedChannel.id} streamUrl={selectedChannel.url} />
                ) : (
                    <div className="h-full flex items-center justify-center bg-black">
                        <p className="text-gray-500 text-lg">Chọn một kênh để bắt đầu xem</p>
                    </div>
                )}
            </div>
            
            {/* Info Panel Area */}
            <div className="h-1/3 bg-gray-800 border-t-2 border-gray-700 p-6 flex flex-col justify-between">
                 {selectedChannel ? (
                    <>
                        <div>
                            {/* Current Program */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">CHƯƠNG TRÌNH ĐANG PHÁT</h3>
                                <p className="text-xl font-bold text-white truncate" title={currentProgram?.title}>{currentProgram?.title || 'Không có thông tin'}</p>
                            </div>
                            
                            {/* Next Program */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">CHƯƠNG TRÌNH TIẾP THEO</h3>
                                <p className="text-lg text-gray-300 truncate" title={nextProgram?.title}>{nextProgram?.title || 'Không có thông tin'}</p>
                            </div>
                        </div>

                        {/* Stream Details */}
                        {streamDetails && (streamDetails.resolution || streamDetails.fps || streamDetails.audio) ? (
                          <div className="border-t border-gray-700 pt-3 mt-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">THÔNG SỐ CỦA LUỒNG STREAM</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
                                {streamDetails.resolution && <span><b className="font-semibold text-gray-400">Độ phân giải:</b> {streamDetails.resolution}</span>}
                                {streamDetails.fps && <span><b className="font-semibold text-gray-400">FPS:</b> {streamDetails.fps}</span>}
                                {streamDetails.audio && <span><b className="font-semibold text-gray-400">Audio:</b> {streamDetails.audio}</span>}
                            </div>
                          </div>
                        ) : (
                          <div/> /* Placeholder to keep layout consistent */
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Thông tin chương trình sẽ hiện ở đây.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};