

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
