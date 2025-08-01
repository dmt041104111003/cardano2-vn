"use client";

import * as React from "react";
import Modal from "../common/Modal";
import { Play } from "lucide-react";
import { VideoSectionEditorProps } from "~/constants/video-section";

export function VideoSectionEditor({
  isOpen,
  onClose,
  videoUrl,
  videoTitle,
  channelName,
  isValidUrl,
  isAdding,
  onVideoUrlChange,
  onVideoTitleChange,
  onChannelNameChange,
  onAddVideo,
}: VideoSectionEditorProps) {
  const [videoId, setVideoId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (videoUrl) {
      const match = videoUrl.match(/(?:v=|\/embed\/|youtu.be\/)([\w-]+)/);
      setVideoId(match ? match[1] : null);
    } else {
      setVideoId(null);
    }
  }, [videoUrl]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Video"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">YouTube Video URL</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              isValidUrl === false ? "border-red-500 focus:ring-red-500" : isValidUrl ? "border-green-500 focus:ring-green-500" : ""
            }`}
          />
          {isValidUrl === false && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video Title</label>
          <input
            type="text"
            placeholder="Enter video title..."
            value={videoTitle}
            onChange={(e) => onVideoTitleChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Channel Name</label>
          <input
            type="text"
            placeholder="Enter channel name..."
            value={channelName}
            onChange={(e) => onChannelNameChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {videoId && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Video Preview
              </span>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video preview"
                allowFullScreen
              />
            </div>
            <div className="text-xs text-gray-500">
              Video ID: {videoId}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={onAddVideo} 
            disabled={!isValidUrl || isAdding || !videoTitle.trim() || !channelName.trim()}
          >
            {isAdding ? "Adding..." : "Add Video"}
          </button>
        </div>
      </div>
    </Modal>
  );
} 