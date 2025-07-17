
import React from 'react';
import { Group } from '../../types';
import { Icon } from '../ui/Icon';
import { LayoutMode } from '../../App';

interface SidebarProps {
  groups: Group[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  viewMode: string;
  setViewMode: (mode: 'CHANNELS' | 'GROUPS' | 'EPG') => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSettingsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    groups, 
    selectedGroup, 
    setSelectedGroup, 
    viewMode, 
    setViewMode, 
    layoutMode, 
    setLayoutMode,
    sidebarOpen,
    setSidebarOpen,
    onSettingsClick,
}) => (
     <aside className={`fixed lg:static top-0 left-0 h-full bg-gray-800 z-30 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 flex-shrink-0 flex flex-col border-r border-gray-700/50`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
            <h1 className="text-xl font-bold text-white flex items-center">
                <Icon name="tv" className="w-7 h-7 mr-2 text-primary"/>
                VMA TV Control
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                <Icon name="close" />
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Chế độ xem</h3>
                 <div className="flex items-center bg-gray-900 rounded-md p-1">
                    <button onClick={() => setLayoutMode('grid')} className={`w-full p-1.5 rounded-l-md text-sm flex items-center justify-center gap-2 ${layoutMode === 'grid' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Xem lưới">
                        <Icon name="view-grid" className="w-4 h-4"/>
                        Lưới
                    </button>
                    <button onClick={() => setLayoutMode('list')} className={`w-full p-1.5 rounded-r-md text-sm flex items-center justify-center gap-2 ${layoutMode === 'list' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Xem danh sách">
                        <Icon name="list-bullet" className="w-4 h-4"/>
                        Danh sách
                    </button>
                </div>
            </div>

            <div>
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quản lý</h3>
                <ul className="space-y-1">
                    <li>
                        <button 
                            onClick={() => { setViewMode('EPG'); setSidebarOpen(false); }} 
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${viewMode === 'EPG' ? 'bg-gray-700 text-primary' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                        >
                            <Icon name="calendar-days" className="w-5 h-5 mr-3" />
                            Lịch Phát Sóng
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => { setViewMode('GROUPS'); setSelectedGroup('Tất cả'); setSidebarOpen(false); }} 
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${viewMode === 'GROUPS' ? 'bg-gray-700 text-primary' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                        >
                            <Icon name="folder-cog" className="w-5 h-5 mr-3" />
                            Quản lý Nhóm
                        </button>
                    </li>
                    <li>
                         <button 
                            onClick={() => { onSettingsClick(); setSidebarOpen(false); }} 
                            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            <Icon name="cog" className="w-5 h-5 mr-3" />
                            Cài đặt
                        </button>
                    </li>
                </ul>
            </div>
            
            <div>
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nhóm Kênh</h3>
                <ul className="space-y-1">
                    <li key="all">
                        <a href="#"
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${selectedGroup === 'Tất cả' && viewMode === 'CHANNELS' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            onClick={(e) => { e.preventDefault(); setSelectedGroup('Tất cả'); setViewMode('CHANNELS'); setSidebarOpen(false); }}>
                            Tất cả
                        </a>
                    </li>
                    {groups.map(group => (
                        <li key={group.id}>
                             <a href="#"
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${selectedGroup === group.name && viewMode === 'CHANNELS' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                onClick={(e) => { e.preventDefault(); setSelectedGroup(group.name); setViewMode('CHANNELS'); setSidebarOpen(false); }}>
                                {group.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    </aside>
  );
