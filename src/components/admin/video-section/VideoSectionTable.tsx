"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Copy, Trash2, Eye } from "lucide-react";
import { useToastContext } from "~/components/toast-provider";
import Modal from "../common/Modal";
import { VideoItem, VideoSectionTableProps } from "~/constants/video-section";

export function VideoSectionTable({ 
  videos, 
  modifiedVideos, 
  onCheckboxChange, 
  onDeleteVideo,
  onViewDetails
}: VideoSectionTableProps) {
  const { showSuccess } = useToastContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedVideoToDelete, setSelectedVideoToDelete] = React.useState<VideoItem | null>(null);

  const handleCopyVideoId = async (videoId: string) => {
    try {
      await navigator.clipboard.writeText(videoId);
      showSuccess("YouTube Video ID copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy video ID:", error);
    }
  };

  const handleViewDetails = (video: VideoItem) => {
    if (onViewDetails) {
      onViewDetails(video);
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
    }
  };

  const handleDeleteClick = (video: VideoItem) => {
    setSelectedVideoToDelete(video);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVideoToDelete) {
      onDeleteVideo(selectedVideoToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedVideoToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.length > 0 ? (
              videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      width={80} 
                      height={45} 
                      className="rounded object-cover" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {video.title.length > 60 ? `${video.title.slice(0, 60)}...` : video.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{video.channelName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={modifiedVideos[video.id]?.isFeatured ?? video.isFeatured}
                      onCheckedChange={(value) => onCheckboxChange(video.id, "isFeatured", !!value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyVideoId(video.videoId)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(video)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(video)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Video"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Video</h3>
              <p className="text-sm text-gray-600">Are you sure you want to delete this video?</p>
            </div>
          </div>
          
          {selectedVideoToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Video to delete:</p>
              <p className="font-medium text-gray-900">{selectedVideoToDelete.title}</p>
              <p className="text-sm text-gray-500">Channel: {selectedVideoToDelete.channelName}</p>
            </div>
          )}
          
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 