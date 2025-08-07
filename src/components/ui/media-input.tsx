"use client";

import React, { useState } from 'react';
import { MediaInputMedia, MediaInputProps } from '~/constants/media';

export default function MediaInput({ onMediaAdd, mediaType = 'image' }: MediaInputProps) {
  const [currentMedia, setCurrentMedia] = useState<MediaInputMedia | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok && result.media?.url) {
        const media: MediaInputMedia = { type: 'image', url: result.media.url, id: result.media.url };
        setCurrentMedia(media);
        if (onMediaAdd) {
          onMediaAdd(media);
        }
        setCurrentMedia(null);
        setImageUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error');
    }
  };

  const handleImageUrl = async (url: string) => {
    setImageUrl(url);
    if (!url) return;
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type: 'IMAGE' }),
      });
      const result = await response.json();
      if (response.ok && result.media?.url) {
        const media: MediaInputMedia = { type: 'image', url: result.media.url, id: result.media.url };
        setCurrentMedia(media);
        if (onMediaAdd) onMediaAdd(media);
        setCurrentMedia(null);
        setImageUrl('');
      } else {
        alert(result.error || 'Failed to add image URL');
      }
    } catch (err) {
      alert('Error adding image URL');
    }
  };

  return (
    <div className="space-y-4">
      {mediaType === 'image' && (
        <>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              className={`px-3 py-1 rounded-t border-b-2 ${activeImageTab === 'upload' ? 'border-emerald-500 text-emerald-600 bg-white dark:bg-gray-700 dark:text-emerald-400' : 'border-transparent text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
              onClick={() => setActiveImageTab('upload')}
            >
              Upload
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-t border-b-2 ${activeImageTab === 'url' ? 'border-emerald-500 text-emerald-600 bg-white dark:bg-gray-700 dark:text-emerald-400' : 'border-transparent text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
              onClick={() => setActiveImageTab('url')}
            >
              Paste URL
            </button>
          </div>
          {activeImageTab === 'upload' && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700"
                onClick={() => fileInputRef.current?.click()}
                title="Upload image from your computer"
              >
                Upload image
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
                title="Upload image from your computer"
                placeholder="Choose image file..."
              />
            </div>
          )}
          {activeImageTab === 'url' && (
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Paste image URL here..."
                value={imageUrl}
                onChange={e => handleImageUrl(e.target.value)}
              />
            </div>
          )}
          {currentMedia?.type === 'image' && currentMedia.url && (
            <div className="flex justify-center">
              <img
                src={currentMedia.url}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden max-w-full max-h-48 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500">Image not available</span>
              </div>
            </div>
          )}
        </>
      )}
      {mediaType === 'youtube' && (
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Paste YouTube video link here..."
            onChange={e => onMediaAdd && onMediaAdd({ type: 'youtube', url: e.target.value, id: e.target.value } as MediaInputMedia)}
          />
          {currentMedia?.type === 'youtube' && (
            <div className="youtube-video">
              <iframe
                src={`https://www.youtube.com/embed/${currentMedia.id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-48 rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 