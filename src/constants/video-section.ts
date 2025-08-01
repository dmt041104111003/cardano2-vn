// VideoItem interfaces
export interface VideoItem {
  id: string;
  videoId: string;
  channelName: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// VideoSectionEditor interfaces
export interface VideoSectionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
  channelName: string;
  isValidUrl: boolean | null;
  isAdding: boolean;
  onVideoUrlChange: (url: string) => void;
  onVideoTitleChange: (title: string) => void;
  onChannelNameChange: (channel: string) => void;
  onAddVideo: () => void;
}

// VideoSectionPagination interfaces
export interface VideoSectionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  onPageChange: (page: number) => void;
}

// VideoSectionStats interfaces
export interface VideoSectionStatsProps {
  videos: VideoItem[];
}

// VideoSectionTable interfaces
export interface VideoSectionTableProps {
  videos: VideoItem[];
  modifiedVideos: { [id: string]: Partial<VideoItem> };
  onCheckboxChange: (videoId: string, field: "isFeatured", value: boolean) => void;
  onDeleteVideo: (videoId: string) => void;
  onViewDetails?: (video: VideoItem) => void;
}

// Video Types from types.ts
export interface Video {
  id: string;
  title: string;
  url: string;
  channelName: string;
  isYouTube?: boolean;
  thumbnailUrl?: string;
  visible: boolean;
}

export interface VideoSectionData {
  sectionTitle: string;
  sectionDescription?: string;
  videos: Video[];
} 