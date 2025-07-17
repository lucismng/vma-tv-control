import React from 'react';
import { Icon } from '../../../components/ui/Icon';

interface ImportM3uModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: string) => void;
}

type Tab = 'url' | 'file';

export const ImportM3uModal: React.FC<ImportM3uModalProps> = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('url');
  const [url, setUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleUrlImport = async () => {
    if (!url) {
      setError('Vui lòng nhập một URL.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      const content = await response.text();
      onImport(content);
      onClose();
    } catch (e) {
      console.error(e);
      setError('Không thể tải từ URL. Vui lòng kiểm tra lại link và chính sách CORS của máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onImport(content);
        setIsLoading(false);
        onClose();
      };
      reader.onerror = () => {
        setError('Không thể đọc file.');
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setUrl('');
    setError(null);
    setIsLoading(false);
    setActiveTab('url');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <Icon name="close" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Import Danh sách kênh M3U</h2>

        <div className="border-b border-gray-600 mb-4">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'url' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              Từ URL
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'file' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
            >
              Tải lên File
            </button>
          </nav>
        </div>

        {error && <p className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-md mb-4">{error}</p>}

        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="m3u-url" className="block text-sm font-medium text-gray-300 mb-1">URL của file .m3u hoặc .m3u8</label>
              <input
                type="url"
                id="m3u-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-primary focus:border-primary"
                placeholder="https://example.com/playlist.m3u"
              />
            </div>
            <button
              onClick={handleUrlImport}
              disabled={isLoading}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover flex items-center justify-center disabled:bg-gray-500"
            >
              {isLoading ? <Icon name="spinner" className="w-5 h-5 mr-2"/> : <Icon name="link" className="w-5 h-5 mr-2"/>}
              {isLoading ? 'Đang tải...' : 'Import từ URL'}
            </button>
          </div>
        )}

        {activeTab === 'file' && (
          <div>
            <label htmlFor="m3u-file-upload" className="block text-sm font-medium text-gray-300 mb-2">Chọn file .m3u hoặc .m3u8 từ máy tính</label>
            <input
              id="m3u-file-upload"
              type="file"
              onChange={handleFileImport}
              accept=".m3u,.m3u8"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <Icon name="spinner" className="w-5 h-5 mr-2"/>
                <span className="text-gray-300">Đang xử lý...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};