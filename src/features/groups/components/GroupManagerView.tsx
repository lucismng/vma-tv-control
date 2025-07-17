import React from 'react';
import { Group, Channel } from '../../../types';
import { Icon } from '../../../components/ui/Icon';

interface GroupManagerViewProps {
  groups: Group[];
  channels: Channel[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
}

export const GroupManagerView: React.FC<GroupManagerViewProps> = ({ groups, channels, setGroups, setChannels }) => {
  const [newGroupName, setNewGroupName] = React.useState('');
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null);
  const [channelAssignments, setChannelAssignments] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState('');

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const filteredChannels = React.useMemo(() => {
    return channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [channels, searchTerm]);

  React.useEffect(() => {
    if (selectedGroup) {
      const assignments = channels.reduce((acc, channel) => {
        acc[channel.id] = channel.group === selectedGroup.name;
        return acc;
      }, {} as Record<string, boolean>);
      setChannelAssignments(assignments);
    } else {
      setChannelAssignments({});
    }
  }, [selectedGroupId, channels, groups]);

  const handleAddGroup = () => {
    if (newGroupName && !groups.some(g => g.name === newGroupName)) {
      const newGroup = { id: `grp-${Date.now()}`, name: newGroupName };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
    } else {
      alert("Tên nhóm không được để trống hoặc đã tồn tại.");
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa nhóm này? Các kênh trong nhóm sẽ được chuyển về 'Uncategorized'.")) {
      const groupToDelete = groups.find(g => g.id === groupId);
      if (!groupToDelete) return;

      // Reassign channels before deleting group
      setChannels(prevChannels =>
        prevChannels.map(ch =>
          ch.group === groupToDelete.name ? { ...ch, group: 'Uncategorized' } : ch
        )
      );

      setGroups(groups.filter(g => g.id !== groupId));
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setChannelAssignments(prev => ({ ...prev, [channelId]: !prev[channelId] }));
  };

  const handleSaveChanges = () => {
    if (!selectedGroup) return;
    setChannels(prevChannels =>
      prevChannels.map(channel => {
        const isInGroup = channelAssignments[channel.id];
        if (isInGroup && channel.group !== selectedGroup.name) {
          return { ...channel, group: selectedGroup.name };
        }
        if (!isInGroup && channel.group === selectedGroup.name) {
          return { ...channel, group: 'Uncategorized' };
        }
        return channel;
      })
    );
    alert(`Đã cập nhật thành viên cho nhóm "${selectedGroup.name}"`);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Icon name="folder-cog" className="w-7 h-7 mr-3 text-primary" />
        Quản lý Nhóm kênh
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Group List & Creation */}
        <div className="md:col-span-1 bg-gray-900 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Danh sách nhóm</h3>
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {groups.map(g => (
              <div
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors ${
                  selectedGroupId === g.id ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <span>{g.name}</span>
                {g.name !== 'Uncategorized' && (
                   <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}
                    className="text-gray-400 hover:text-red-400 p-1"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Tên nhóm mới"
              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
            />
            <button onClick={handleAddGroup} className="bg-primary p-2 rounded-md hover:bg-primary-hover">
              <Icon name="plus" />
            </button>
          </div>
        </div>

        {/* Channel Assignment */}
        <div className="md:col-span-2 bg-gray-900 p-4 rounded-lg flex flex-col h-[75vh]">
          {selectedGroup ? (
            <>
              <div>
                <h3 className="font-bold text-lg mb-4">Gán kênh cho nhóm: <span className="text-primary">{selectedGroup.name}</span></h3>
                <div className="relative mb-4">
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
              
              <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                 {filteredChannels.length > 0 ? filteredChannels.map(channel => (
                  <label key={channel.id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600">
                    <input
                      type="checkbox"
                      checked={!!channelAssignments[channel.id]}
                      onChange={() => handleChannelToggle(channel.id)}
                      className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-primary focus:ring-primary"
                      disabled={selectedGroup.name === 'Uncategorized'}
                    />
                     <img src={channel.logo || `https://picsum.photos/seed/${channel.id}/40`} alt="" className="w-10 h-10 object-contain rounded-md bg-gray-800"/>
                    <span className="text-white">{channel.name}</span>
                  </label>
                )) : (
                    <p className="text-gray-500 text-center pt-8">Không tìm thấy kênh nào.</p>
                )}
              </div>
              {selectedGroup.name !== 'Uncategorized' && (
                  <div className="mt-6 flex justify-end flex-shrink-0">
                    <button onClick={handleSaveChanges} className="bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-primary-hover">
                      Lưu thay đổi
                    </button>
                  </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Chọn một nhóm từ danh sách để bắt đầu gán kênh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};