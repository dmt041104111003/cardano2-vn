// "use client";

import { VideoSectionPageClient } from "~/components/admin/video-section/VideoSectionPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Section Management | Admin",
  description: "Manage YouTube videos for the video section",
};

export default function VideoSectionPage() {
  return <VideoSectionPageClient />;
}
