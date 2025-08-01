'use client';

import { Image as ImageIcon, Youtube } from 'lucide-react';
import { UploadTabsProps } from '~/constants/media';

export function UploadTabs({ uploadType, onTypeChange }: UploadTabsProps) {
  return (
    <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onTypeChange('image')}
        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          uploadType === 'image'
            ? 'bg-white text-emerald-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        Upload Image
      </button>
      <button
        onClick={() => onTypeChange('youtube')}
        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          uploadType === 'youtube'
            ? 'bg-white text-emerald-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Youtube className="h-4 w-4 mr-2" />
        YouTube Link
      </button>
    </div>
  );
} 