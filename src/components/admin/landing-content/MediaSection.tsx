"use client";

import React from 'react';
import MediaInput from '~/components/ui/media-input';
import { LandingContentFormData } from '~/constants/admin';

interface MediaSectionProps {
  formData: Pick<LandingContentFormData, 'media1Url' | 'media2Url' | 'media3Url' | 'media4Url'>;
  setFormData: React.Dispatch<React.SetStateAction<LandingContentFormData>>;
  handleMediaSelect: (media: { id: string; url: string; type: string }) => void;
  handleRemoveMedia: (index: number) => void;
}

export default function MediaSection({ formData, setFormData, handleMediaSelect, handleRemoveMedia }: MediaSectionProps) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Media
      </h4>
      
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Upload Images/Videos (up to 4)
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((index) => {
                const mediaField = `media${index + 1}Url` as keyof typeof formData;
                const mediaUrl = formData[mediaField];
                
                return (
                  <div key={index} className="relative">
                    <div className="relative group">
                      <img
                        src={mediaUrl || "/images/common/loading.png"}
                        alt={`Media ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      {mediaUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          title="Remove media"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4">
              <MediaInput
                onMediaAdd={(media) => handleMediaSelect(media)}
                onMediaAddMany={(medias) => {
                  const urls = medias.map(m => m.url).slice(0, 4);
                  setFormData(prev => ({
                    ...prev,
                    media1Url: urls[0] || '',
                    media2Url: urls[1] || '',
                    media3Url: urls[2] || '',
                    media4Url: urls[3] || ''
                  }));
                }}
                mediaType="image"
                multiple
              />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0,1,2,3].map((index) => {
                const mediaField = `media${index + 1}Url` as keyof typeof formData;
                const label = `Media ${index + 1} URL`;
                return (
                  <div key={`media-url-${index}`} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
                    <input
                      type="url"
                      value={formData[mediaField] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [mediaField]: e.target.value } as any))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 