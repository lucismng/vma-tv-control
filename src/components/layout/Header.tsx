import React from 'react';
import { Icon } from '../ui/Icon';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    title: string;
    onAddChannel: () => void;
    onImport: () => void;
    onExport: () => void;
    isReordering: boolean;
    setIsReordering: (reordering: boolean) => void;
    viewMode: string;
}

export const Header: React.FC<HeaderProps> = ({
    sidebarOpen,
    setSidebarOpen,
    title,
    onAddChannel,
    onImport,
    onExport,
    isReordering,
    setIsReordering,
    viewMode
}) => {
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-20 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400">
                    <Icon name="menu" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wider">{formatTime(now)}</h1>
                    <div className="text-xs text-gray-400 mt-1">
                        <span>{formatDate(now)}</span>
                    </div>
                     <p className="text-sm text-gray-300 mt-1">{title}</p>
                </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
                {viewMode === 'CHANNELS' && (
                    <button 
                        onClick={() => setIsReordering(!isReordering)} 
                        className={`px-3 py-2 text-sm font-medium rounded-md flex items-center transition-colors ${
                            isReordering ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title={isReordering ? 'Lưu thứ tự mới' : 'Sắp xếp lại thứ tự kênh'}
                    >
                       <span className="hidden sm:inline">{isReordering ? 'Lưu thứ tự' : 'Sắp xếp'}</span>
                       <span className="sm:hidden">{isReordering ? <Icon name="check" className="w-5 h-5"/> : <Icon name="drag-handle" className="w-5 h-5"/>}</span>
                    </button>
                )}
                <button onClick={onAddChannel} className="px-3 py-2 text-sm font-medium rounded-md flex items-center bg-primary text-white hover:bg-primary-hover">
                    <Icon name="plus" className="w-5 h-5 mr-0 sm:mr-2" />
                    <span className="hidden sm:inline">Thêm Kênh</span>
                </button>
                <div className="flex items-center">
                    <button onClick={onImport} className="p-2 text-gray-300 bg-gray-700 rounded-l-md hover:bg-gray-600 hover:text-white" title="Import M3U"><Icon name="upload" /></button>
                    <button 
                        onClick={onExport} 
                        className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded-r-md flex items-center justify-center transition-colors"
                        title="Export file M3U"
                    >
                       <Icon name="download" className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </header>
    );
};
