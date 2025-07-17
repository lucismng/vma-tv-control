import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import { EpgCheckStatus, EpgSource } from '../../../types';
import { checkEpgUrl } from '../../../services/epgService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  epgSources: EpgSource[];
  onSaveEpgSources: (sources: EpgSource[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    epgSources, 
    onSaveEpgSources,
}) => {
  const [currentSources, setCurrentSources] = React.useState<EpgSource[]>(epgSources);
  const [newUrl, setNewUrl] = React.useState('');
  const [checkStatuses, setCheckStatuses] = React.useState<Record<string, { status: EpgCheckStatus; message: string | null }>>({});

  React.useEffect(() => {
    // Reset state when modal opens or props change
    setCurrentSources(epgSources);
    setCheckStatuses({});
    setNewUrl('');
  }, [epgSources, isOpen]);

  const handleCheck = async (id: string, url: string) => {
    setCheckStatuses(prev => ({ ...prev, [id]: { status: EpgCheckStatus.CHECKING, message: 'Đang kiểm tra...' } }));
    const result = await checkEpgUrl(url);
    setCheckStatuses(prev => ({ ...prev, [id]: { status: result.status, message: result.message } }));
  };

  const handleAddSource = () => {
    if (newUrl && !currentSources.some(s => s.url === newUrl)) {
        const newSource = { id: `epg-${Date.now()}`, url: newUrl };
        setCurrentSources([...currentSources, newSource]);
        setNewUrl('');
    } else {
        alert('URL không được để trống hoặc đã tồn tại.');
    }
  }

  const handleDeleteSource = (id: string) => {
    setCurrentSources(currentSources.filter(s => s.id !== id));
    // Also remove from check statuses
    const newStatuses = { ...checkStatuses };
    delete newStatuses[id];
    setCheckStatuses(newStatuses);
  }

  const handleSave = () => {
    onSaveEpgSources(currentSources);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <Icon name="cog" className="w-6 h-6 mr-3" />
          Cài đặt
        </h2>
        
        <div className="space-y-8">
            {/* EPG Settings */}
            <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                <h3 className="font-bold text-lg text-primary">Nguồn EPG (Lịch phát sóng)</h3>
                <p className="text-sm text-gray-400">Thêm một hoặc nhiều URL XMLTV. Dữ liệu sẽ được tự động tổng hợp.</p>
                
                {/* Add new source input */}
                <div className="flex items-center space-x-2">
                    <input
                        type="url"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary"
                        placeholder="Dán URL XMLTV mới tại đây..."
                    />
                    <button onClick={handleAddSource} className="bg-primary p-2 rounded-md hover:bg-primary-hover">
                        <Icon name="plus" />
                    </button>
                </div>
                
                {/* List of sources */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {currentSources.map(source => {
                        const statusInfo = checkStatuses[source.id];
                        let iconName: 'spinner' | 'check' | 'error' = 'spinner';
                        let textColor = 'text-yellow-400';
                        if (statusInfo?.status === EpgCheckStatus.VALID) { iconName = 'check'; textColor = 'text-green-400'; }
                        if (statusInfo?.status === EpgCheckStatus.INVALID) { iconName = 'error'; textColor = 'text-red-400'; }

                        return (
                            <div key={source.id} className="bg-gray-900/50 p-3 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <input type="text" readOnly value={source.url} className="flex-grow bg-transparent text-gray-300 truncate"/>
                                    <button onClick={() => handleCheck(source.id, source.url)} className="p-1 text-gray-400 hover:text-white" title="Kiểm tra"><Icon name="refresh" className={statusInfo?.status === EpgCheckStatus.CHECKING ? 'animate-spin' : ''} /></button>
                                    <button onClick={() => handleDeleteSource(source.id)} className="p-1 text-gray-400 hover:text-red-400" title="Xóa"><Icon name="trash" /></button>
                                </div>
                                {statusInfo && (
                                    <div className="flex items-start space-x-2 mt-2">
                                        <Icon name={iconName} className={`w-4 h-4 flex-shrink-0 mt-0.5 ${textColor}`} />
                                        <p className={`text-xs ${textColor}`}>{statusInfo.message}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-8 mt-4 border-t border-gray-700">
          <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-3 hover:bg-gray-500">
            Hủy
          </button>
          <button type="button" onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
            Lưu Cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};