"use client";

import * as React from "react";
import { AdminStats } from "../common/AdminStats";

interface VideoItem {
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

interface VideoSectionStatsProps {
  videos: VideoItem[];
}

export function VideoSectionStats({ videos }: VideoSectionStatsProps) {
  const stats = [
    { label: 'Total Videos', value: videos.length, color: 'blue' as const },
    { label: 'Featured Videos', value: videos.filter(v => v.isFeatured).length, color: 'green' as const },
  ];

  return <AdminStats stats={stats} />;
} 