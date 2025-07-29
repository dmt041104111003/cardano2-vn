"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Video {
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

async function fetchVideos(): Promise<Video[]> {
  const res = await fetch("/api/video-section");
  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }
  return res.json();
}

export default function VideoSection() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["video-section"],
    queryFn: fetchVideos,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });

  React.useEffect(() => {
    if (videos.length > 0 && !currentVideo) {
      const featuredVideo = videos.find((video: Video) => video.isFeatured);
      setCurrentVideo(featuredVideo || videos[0]);
    }
  }, [videos, currentVideo]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const sortedVideos = videos.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const displayedVideos = showAllVideos ? sortedVideos : sortedVideos.slice(0, 2);

  if (isLoading) {
    return (
      <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
        <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
          <div className="relative">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Videos</h2>
              </div>
              <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">Loading videos...</div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  if (error) {
    return (
      <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
        <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
          <div className="relative">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Videos</h2>
              </div>
              <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600 dark:text-red-400">Error loading videos. Please try again later.</div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  if (!currentVideo || videos.length === 0) {
    return (
      <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
        <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
          <div className="relative">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Videos</h2>
              </div>
              <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">No videos available.</div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
      <section className="mx-auto w-5/6 max-w-screen-2xl px-6 py-20 lg:px-8">
        <div className="relative">
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">The Cardano2vn Videos</h2>
            </div>
            <p className="max-w-3xl text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[70%]">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`}
                  title={currentVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentVideo.title}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">{currentVideo.channelName}</p>
            </div>

            <div className="w-full lg:w-[30%] max-h-[84vh] p-6 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Playlist – Videos Cardano2vn</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select a video to watch</p>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thick scrollbar-thumb-red-500 dark:scrollbar-thumb-red-400 scrollbar-track-gray-300 dark:scrollbar-track-gray-600 hover:scrollbar-thumb-red-600 dark:hover:scrollbar-thumb-red-300 pr-3">
                {displayedVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      currentVideo.id === video.id 
                        ? "bg-blue-50 dark:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-700 shadow-lg" 
                        : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50 hover:shadow-md"
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col justify-between overflow-hidden flex-1">
                      <p className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white leading-tight">{video.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.channelName}</p>
                    </div>
                  </div>
                ))}
              </div>
              {sortedVideos.length > 2 && (
                <button
                  onClick={() => setShowAllVideos(!showAllVideos)}
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showAllVideos ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
