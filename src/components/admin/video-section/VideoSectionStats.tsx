"use client";

import * as React from "react";
import { AdminStats } from "../common/AdminStats";
import { VideoItem, VideoSectionStatsProps } from "~/constants/video-section";

export function VideoSectionStats({ videos }: VideoSectionStatsProps) {
  const stats = [
    { label: 'Total Videos', value: videos.length, color: 'blue' as const },
    { label: 'Featured Videos', value: videos.filter(v => v.isFeatured).length, color: 'green' as const },
  ];

  return <AdminStats stats={stats} />;
} 