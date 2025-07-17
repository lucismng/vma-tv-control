export enum StreamStatus {
  IDLE = 'IDLE',
  CHECKING = 'CHECKING',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface StreamDetails {
  resolution?: string; // e.g., "1920x1080"
  fps?: number;
  audio?: string; // e.g., "aac", "mp3"
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string; // Base64 or URL
  group: string;
  tvgId: string; // TVG-ID for EPG mapping
  status: StreamStatus;
  streamDetails?: StreamDetails;
  order: number;
}

export interface Group {
    id: string;
    name: string;
}

export interface EpgProgram {
  title: string;
  description:string;
  start: Date;
  end: Date;
}

export enum EpgCheckStatus {
  IDLE = 'IDLE',
  CHECKING = 'CHECKING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export interface EpgSource {
  id: string;
  url: string;
}