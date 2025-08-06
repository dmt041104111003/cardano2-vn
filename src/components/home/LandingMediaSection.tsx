"use client";

import React from 'react';

interface MediaItem {
  url: string;
  type: string;
  title: string;
}

interface LandingMediaSectionProps {
  mediaItems: MediaItem[];
}

export default function LandingMediaSection({ mediaItems }: LandingMediaSectionProps) {
  return (
    <section className="relative hidden lg:block">
      <div className="relative">
        <div className="relative h-[55vh] w-full">
          {mediaItems[0] && (
            <div className="absolute left-12 top-0 z-10 h-48 w-56 -rotate-2 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${mediaItems[0].url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
              <div className="relative flex h-full flex-col justify-end p-4">
                <div className="mb-3 h-8 w-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
                <div className="space-y-1">
                  <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                  <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </div>
          )}
          {mediaItems[1] && (
            <div className="absolute right-8 top-8 z-20 h-64 w-64 rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${mediaItems[1].url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-800/40 to-transparent"></div>
              <div className="relative flex h-full flex-col justify-end p-4">
                <div className="mb-3 h-12 w-full bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                <div className="space-y-2">
                  <div className="h-1.5 w-2/3 bg-gray-300 dark:bg-white/20"></div>
                  <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </div>
          )}
          {mediaItems[2] && (
            <div className="absolute bottom-24 left-4 z-30 h-60 w-72 -rotate-1 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${mediaItems[2].url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent"></div>
              <div className="relative flex h-full flex-col justify-end p-4">
                <div className="mb-3 h-12 w-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>
                <div className="space-y-2">
                  <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20"></div>
                  <div className="h-1.5 w-2/3 bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </div>
          )}
          {mediaItems[3] && (
            <div className="absolute bottom-12 right-12 z-40 h-52 w-52 rotate-3 transform overflow-hidden border-8 border-gray-200 dark:border-white shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${mediaItems[3].url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/40 to-transparent"></div>
              <div className="relative flex h-full flex-col justify-end p-4">
                <div className="mb-3 h-10 w-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                <div className="space-y-1">
                  <div className="h-1.5 w-3/5 bg-gray-300 dark:bg-white/20"></div>
                  <div className="h-1.5 w-4/5 bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
