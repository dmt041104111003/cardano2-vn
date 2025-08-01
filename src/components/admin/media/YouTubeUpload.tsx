'use client';

import { useState } from 'react';
import { useToastContext } from '~/components/toast-provider';
import { YouTubeUploadProps } from '~/constants/media';

export function YouTubeUpload({ onUploadSuccess }: YouTubeUploadProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const handleYoutubeUpload = async () => {
    if (!youtubeUrl.trim()) {
      showError('Empty URL', 'Please enter a YouTube URL.');
      return;
    }
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      showError('Invalid YouTube URL', 'Please enter a valid YouTube URL.');
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: youtubeUrl,
          type: 'YOUTUBE',
        }),
      });

      if (response.ok) {
        showSuccess('YouTube link added', 'YouTube link has been added successfully.');
        setYoutubeUrl('');
        onUploadSuccess();
      } else {
        const error = await response.json();
        showError('Upload failed', error.message || 'Failed to add YouTube link.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Upload error', 'An error occurred while adding YouTube link.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isUploading}
          title="YouTube URL"
        />
      </div>
      <button
        onClick={handleYoutubeUpload}
        disabled={isUploading || !youtubeUrl.trim()}
        className="w-full bg-transparent border-2 border-emerald-500 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Adding...' : 'Add YouTube Link'}
      </button>
      <p className="text-xs text-gray-500">
        Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
      </p>
    </div>
  );
} 