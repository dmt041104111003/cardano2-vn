// ImageUpload interfaces
export interface ImageUploadProps {
  onUploadSuccess: () => void;
}

// Media interfaces
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  usageTitles?: string[];
  usedInPosts?: string[];
}

// MediaTable interfaces
export interface MediaTableProps {
  media: Media[];
  onDelete: (id: string) => void;
}

// MediaUpload interfaces
export interface MediaUploadProps {
  isOpen: boolean;
  onUploadSuccess: () => void;
  onClose: () => void;
}

// UploadTabs interfaces
export interface UploadTabsProps {
  uploadType: 'image' | 'youtube';
  onTypeChange: (type: 'image' | 'youtube') => void;
}

// YouTubeUpload interfaces
export interface YouTubeUploadProps {
  onUploadSuccess: () => void;
}

// MediaInput Components Interfaces
export interface MediaInputMedia {
  type: 'youtube' | 'image';
  url: string;
  id: string;
}

export interface MediaInputProps {
  onMediaAdd?: (media: MediaInputMedia) => void;
  mediaType?: 'image' | 'youtube';
  multiple?: boolean;
} 