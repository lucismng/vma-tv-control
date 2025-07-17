import React from 'react';
import { Channel, StreamStatus } from '../../../types';
import { checkStreamStatus } from '../../../services/streamCheckService';
import { Icon } from '../../../components/ui/Icon';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: Omit<Channel, 'status' | 'streamDetails' | 'order'>) => void;
  channelToEdit: Channel | null;
}

const StreamStatusIndicator: React.FC<{ status: StreamStatus }> = ({ status }) => {
  switch (status) {
    case StreamStatus.CHECKING:
      return <Icon name="spinner" className="w-5 h-5 text-yellow-400" />;
    case StreamStatus.ONLINE:
      return <Icon name="check" className="w-5 h-5 text-green-400" />;
    case StreamStatus.OFFLINE:
      return <Icon name="error" className="w-5 h-5 text-red-400" />;
    default:
      return null;
  }
};

export const ChannelModal: React.FC<ChannelModalProps> = ({ isOpen, onClose, onSave, channelToEdit }) => {
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [logo, setLogo] = React.useState('');
  const [tvgId, setTvgId] = React.useState('');
  const [currentStreamStatus, setCurrentStreamStatus] = React.useState<StreamStatus>(StreamStatus.IDLE);
  
  React.useEffect(() => {
    if (channelToEdit) {
      setName(channelToEdit.name);
      setUrl(channelToEdit.url);
      setLogo(channelToEdit.logo);
      setTvgId(channelToEdit.tvgId);
      setCurrentStreamStatus(channelToEdit.status);
    } else {
      // Reset form
      setName('');
      setUrl('');
      setLogo('');
      setTvgId('');
      setCurrentStreamStatus(StreamStatus.IDLE);
    }
  }, [channelToEdit, isOpen]);

  const handleUrlBlur = React.useCallback(async () => {
    if (url) {
      setCurrentStreamStatus(StreamStatus.CHECKING);
      const { status } = await checkStreamStatus(url);
      setCurrentStreamStatus(status);
    }
  }, [url]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target && typeof event.target.result === 'string') {
            setLogo(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url) {
      onSave({
        id: channelToEdit ? channelToEdit.id : `ch-${Date.now()}`,
        name,
        url,
        logo,
        tvgId: tvgId.trim(), // Trim whitespace from TVG ID
        group: channelToEdit ? channelToEdit.group : 'Uncategorized', // Default to Uncategorized
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">{channelToEdit ? 'Chỉnh sửa Kênh' : 'Thêm Kênh Mới'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="channel-name" className="block text-sm font-medium text-gray-300 mb-1">Tên kênh</label>
                <input
                type="text"
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary"
                required
                />
            </div>
            <div>
                <label htmlFor="tvg-id" className="block text-sm font-medium text-gray-300 mb-1">TVG ID</label>
                <input
                type="text"
                id="tvg-id"
                value={tvgId}
                onChange={(e) => setTvgId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary"
                placeholder="Ví dụ: VTV1.vn"
                />
            </div>
          </div>
          
          <div>
            <label htmlFor="stream-url" className="block text-sm font-medium text-gray-300 mb-1">URL Stream</label>
            <div className="relative">
              <input
                type="text"
                id="stream-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary pr-10"
                placeholder="https://...m3u8"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <StreamStatusIndicator status={currentStreamStatus} />
              </div>
            </div>
             <p className="text-xs text-gray-400 mt-1">Trạng thái sẽ được kiểm tra khi bạn rời khỏi ô này.</p>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-grow">
              <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-1">Logo Kênh (URL hoặc Upload)</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="Dán URL logo hoặc upload bên dưới"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary mb-2"
              />
              <input
                type="file"
                id="logo-upload"
                onChange={handleLogoUpload}
                accept="image/png, image/jpeg, image/svg+xml"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
              />
            </div>
            {logo && (
              <div className="flex-shrink-0">
                <p className="text-sm font-medium text-gray-300 mb-1 text-center">Preview</p>
                <img src={logo} alt="Logo Preview" className="w-16 h-16 object-contain bg-gray-700 rounded-md p-1 border border-gray-600"/>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-3 hover:bg-gray-500">
              Hủy
            </button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover flex items-center">
              <Icon name="plus" className="w-5 h-5 mr-2"/>
              Lưu Kênh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};