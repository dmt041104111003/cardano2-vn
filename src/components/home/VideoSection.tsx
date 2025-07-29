"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Video {
  id: string;
  videoId: string;
  channelName: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  isSlideshow: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/video-section");
        const data = await res.json();

        setVideos(data);

        if (data.length > 0) {
          const featuredVideo = data.find((video: Video) => video.isFeatured);
          setCurrentVideo(featuredVideo || data[0]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    fetchVideos();
  }, []);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  if (!currentVideo) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="lg:p-24 md:p-12 p-4 mx-auto text-white dark:bg-gray-900 bg-gray-100 border-gray">
      <div className="mb-10 flex items-center gap-4">
        <div className="h-1 w-12 bg-gradient-to-r from-red-600 dark:from-white to-transparent"></div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">Memorable Moments</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[70%]">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`}
              title={currentVideo.title}
              allowFullScreen
            ></iframe>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{currentVideo.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentVideo.channelName}</p>
        </div>

        <div className="w-full lg:w-[30%] max-h-[84vh] p-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-transparent shadow-md">
          <div className="mb-4">
            <h2 className="text-lg py-2 font-semibold text-gray-800 dark:text-white truncate">Playlist – {currentVideo.title}</h2>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  currentVideo.id === video.id ? "dark:bg-blue-900 dark:text-white bg-gray-300" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="relative w-28 h-16 shrink-0 rounded overflow-hidden">
                  <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between overflow-hidden">
                  <p className="text-sm font-medium line-clamp-2 text-black dark:text-white">{video.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{video.channelName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
