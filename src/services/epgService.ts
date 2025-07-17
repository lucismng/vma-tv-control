import { EpgCheckStatus, EpgProgram } from '../types';

interface EpgCheckResult {
  status: EpgCheckStatus.VALID | EpgCheckStatus.INVALID;
  message: string;
}

/**
 * Checks if a given URL points to a valid XMLTV source.
 * @param url The URL of the XMLTV file.
 * @returns A promise that resolves to an object containing the validation status and a message.
 */
export const checkEpgUrl = async (url: string): Promise<EpgCheckResult> => {
  if (!url || !url.startsWith('http')) {
    return {
      status: EpgCheckStatus.INVALID,
      message: 'URL không hợp lệ. Vui lòng nhập một URL http hoặc https.',
    };
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        status: EpgCheckStatus.INVALID,
        message: `Lỗi kết nối. Máy chủ trả về mã lỗi: ${response.status}`,
      };
    }

    const textContent = await response.text();

    // Basic validation: check for common XMLTV tags.
    if (textContent.includes('<tv') && (textContent.includes('<channel') || textContent.includes('<programme'))) {
      return {
        status: EpgCheckStatus.VALID,
        message: 'Hợp lệ. Đã tìm thấy dữ liệu XMLTV.',
      };
    } else {
      return {
        status: EpgCheckStatus.INVALID,
        message: 'Không phải định dạng XMLTV. Nội dung không chứa các thẻ cần thiết.',
      };
    }
  } catch (error) {
    console.error('EPG Check Error:', error);
    let message = 'Đã xảy ra lỗi không xác định.';
    if (error instanceof TypeError) {
      // This often indicates a network error or CORS issue
      message = 'Lỗi mạng hoặc CORS. Không thể truy cập URL từ trình duyệt. Hãy đảm bảo máy chủ cho phép truy cập.';
    }
    return {
      status: EpgCheckStatus.INVALID,
      message: message,
    };
  }
};


/**
 * Parses the YYYYMMDDHHMMSS ZZZZ string from XMLTV to a Date object.
 * @param timeStr The time string from XMLTV.
 * @returns A Date object.
 */
const parseEpgTime = (timeStr: string): Date => {
    const year = parseInt(timeStr.substring(0, 4), 10);
    const month = parseInt(timeStr.substring(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(timeStr.substring(6, 8), 10);
    const hours = parseInt(timeStr.substring(8, 10), 10);
    const minutes = parseInt(timeStr.substring(10, 12), 10);
    const seconds = parseInt(timeStr.substring(12, 14), 10);
    
    // The timezone part is complex, for simplicity we create a local date
    // A more robust solution might handle the offset properly
    return new Date(year, month, day, hours, minutes, seconds);
};


/**
 * Fetches and parses XMLTV data from a URL.
 * @param url The URL of the XMLTV file.
 * @returns A promise that resolves to a record mapping tvg-id to its program list.
 */
export const fetchAndParseEpgData = async (url: string): Promise<Record<string, EpgProgram[]>> => {
    if (!url) throw new Error("URL EPG không được cung cấp.");

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Không thể tải dữ liệu EPG: ${response.statusText}`);
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        throw new Error('Không thể phân tích file XML. Định dạng không hợp lệ.');
    }

    const programs: Record<string, EpgProgram[]> = {};
    const programmeNodes = xmlDoc.getElementsByTagName('programme');

    for (let i = 0; i < programmeNodes.length; i++) {
        const node = programmeNodes[i];
        const channelId = node.getAttribute('channel');
        const startStr = node.getAttribute('start');
        const stopStr = node.getAttribute('stop');
        
        const titleNode = node.getElementsByTagName('title')[0];
        const descNode = node.getElementsByTagName('desc')[0];

        if (channelId && startStr && stopStr && titleNode) {
            if (!programs[channelId]) {
                programs[channelId] = [];
            }
            programs[channelId].push({
                title: titleNode.textContent || 'Không có tiêu đề',
                description: descNode?.textContent || '',
                start: parseEpgTime(startStr),
                end: parseEpgTime(stopStr),
            });
        }
    }
    
    // Sort programs by start time for each channel
    for (const channelId in programs) {
        programs[channelId].sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    return programs;
};

/**
 * Fetches and merges EPG data from multiple URLs.
 * @param urls An array of XMLTV file URLs.
 * @returns A promise that resolves to the merged EPG data and a list of errors.
 */
export const fetchAllEpgData = async (urls: string[]): Promise<{ mergedData: Record<string, EpgProgram[]>, errors: { url: string, reason: any }[] }> => {
    const mergedData: Record<string, EpgProgram[]> = {};
    const errors: { url: string, reason: any }[] = [];

    const results = await Promise.allSettled(
        urls.map(url => fetchAndParseEpgData(url))
    );

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            // Merge fulfilled data
            for (const channelId in result.value) {
                if (mergedData[channelId]) {
                    mergedData[channelId].push(...result.value[channelId]);
                    // Re-sort after merge
                    mergedData[channelId].sort((a, b) => a.start.getTime() - b.start.getTime());
                } else {
                    mergedData[channelId] = result.value[channelId];
                }
            }
        } else {
            // Collect errors
            console.error(`Failed to fetch EPG from ${urls[index]}:`, result.reason);
            errors.push({ url: urls[index], reason: result.reason });
        }
    });

    return { mergedData, errors };
};
