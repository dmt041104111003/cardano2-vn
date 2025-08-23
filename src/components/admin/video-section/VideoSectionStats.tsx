"use client";

import * as React from "react";
import { AdminStats } from "../common/AdminStats";
import { VideoItem, VideoSectionStatsProps } from "~/constants/video-section";

export function VideoSectionStats({ videos }: VideoSectionStatsProps) {
  const stats = [
    { label: 'Total Videos', value: Array.isArray(videos) ? videos.length : 0, color: 'blue' as const },
    { label: 'Featured Videos', value: Array.isArray(videos) ? videos.filter(v => v.isFeatured).length : 0, color: 'green' as const },
  ];

  return <AdminStats stats={stats} />;
} 