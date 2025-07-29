"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoSectionSkeleton from "./VideoSectionSkeleton";

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
    return <VideoSectionSkeleton />;
  }

  if (error) {
    return (
      <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
        <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="relative">
            <div className="mb-8 lg:mb-16">
              <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
                <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">The Cardano2vn Videos</h2>
              </div>
              <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
            </div>
            <div className="flex items-center justify-center h-32 lg:h-64">
              <div className="text-base lg:text-lg text-red-600 dark:text-red-400">Error loading videos. Please try again later.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentVideo || videos.length === 0) {
    return (
      <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
        <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="relative">
            <div className="mb-8 lg:mb-16">
              <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
                <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">The Cardano2vn Videos</h2>
              </div>
              <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
            </div>
            <div className="flex items-center justify-center h-32 lg:h-64">
              <div className="text-base lg:text-lg text-gray-600 dark:text-gray-400">No videos available.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
      <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
        <div className="relative">
          <div className="mb-8 lg:mb-16">
            <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
              <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">The Cardano2vn Videos</h2>
            </div>
            <p className="max-w-3xl text-base lg:text-xl text-gray-700 dark:text-gray-300">Watch our latest videos and memorable moments.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-[60%]">
              <div className="relative w-full aspect-video rounded-lg lg:rounded-xl overflow-hidden mb-4 lg:mb-6 shadow-lg lg:shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`}
                  title={currentVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2 line-clamp-2">{currentVideo.title}</h3>
              <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 font-medium">{currentVideo.channelName}</p>
            </div>

            <div className={`w-full lg:w-[40%] ${showAllVideos ? 'max-h-[60vh] lg:max-h-[84vh]' : 'max-h-fit'} p-4 lg:p-6 border border-gray-200 dark:border-gray-600 rounded-lg lg:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg lg:shadow-xl`}>
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">Playlist – Videos Cardano2vn</h3>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Select a video to watch</p>
              </div>

              <div className={`space-y-3 lg:space-y-4 ${showAllVideos ? 'max-h-[45vh] lg:max-h-[70vh] overflow-y-auto' : ''} scrollbar-thick scrollbar-thumb-red-500 dark:scrollbar-thumb-red-400 scrollbar-track-gray-300 dark:scrollbar-track-gray-600 hover:scrollbar-thumb-red-600 dark:hover:scrollbar-thumb-red-300 pr-2 lg:pr-3`}>
                {displayedVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl cursor-pointer transition-all duration-200 ${
                      currentVideo.id === video.id 
                        ? "bg-blue-50 dark:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-700 shadow-lg" 
                        : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50 hover:shadow-md"
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative w-24 h-16 lg:w-32 lg:h-20 shrink-0 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col justify-between overflow-hidden flex-1">
                      <p className="text-xs lg:text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white leading-tight">{video.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{video.channelName}</p>
                    </div>
                  </div>
                ))}
              </div>
              {sortedVideos.length > 2 && (
                <button
                  onClick={() => setShowAllVideos(!showAllVideos)}
                  className="w-full text-center text-xs lg:text-sm text-blue-600 dark:text-blue-400 hover:underline mt-3 lg:mt-4"
                >
                  {showAllVideos ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
