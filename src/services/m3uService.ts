import { Channel, StreamStatus } from '../types';

export const parseM3U = (content: string): Partial<Channel>[] => {
  const channels: Partial<Channel>[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF:')) {
      const infoLine = lines[i];
      const urlLine = lines[i + 1] && !lines[i + 1].startsWith('#') ? lines[i + 1].trim() : '';

      if (urlLine) {
        const nameMatch = infoLine.match(/,(.*)$/);
        const name = nameMatch ? nameMatch[1] : 'Unknown Channel';

        const logoMatch = infoLine.match(/tvg-logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : '';

        const groupMatch = infoLine.match(/group-title="([^"]+)"/);
        const group = groupMatch ? groupMatch[1] : 'Uncategorized';
        
        const tvgIdMatch = infoLine.match(/tvg-id="([^"]+)"/);
        const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

        channels.push({
          id: `m3u-${Date.now()}-${channels.length}`,
          name,
          url: urlLine,
          logo,
          group,
          tvgId,
          status: StreamStatus.IDLE,
        });
      }
    }
  }
  return channels;
};

export const generateM3U = (channels: Channel[], epgUrls: string[] = []): string => {
  let m3uContent = `#EXTM3U${epgUrls.length > 0 ? ` url-tvg="${epgUrls.join(',')}"` : ''}\n`;
  channels.forEach(channel => {
    m3uContent += `#EXTINF:-1 tvg-id="${channel.tvgId || ''}" tvg-logo="${channel.logo}" group-title="${channel.group}",${channel.name}\n`;
    m3uContent += `${channel.url}\n`;
  });
  return m3uContent;
};
