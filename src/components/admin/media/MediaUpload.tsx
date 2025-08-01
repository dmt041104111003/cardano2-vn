'use client';

import { useState } from 'react';
import Modal from '~/components/admin/common/Modal';
import { UploadTabs } from './UploadTabs';
import { ImageUpload } from './ImageUpload';
import { YouTubeUpload } from './YouTubeUpload';
import { MediaUploadProps } from '~/constants/media';

export function MediaUpload({ isOpen, onUploadSuccess, onClose }: MediaUploadProps) {
  const [uploadType, setUploadType] = useState<'image' | 'youtube'>('image');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Media" maxWidth="max-w-md">
      <div>
        <UploadTabs 
          uploadType={uploadType} 
          onTypeChange={setUploadType} 
        />
        
        {uploadType === 'image' && (
          <ImageUpload onUploadSuccess={onUploadSuccess} />
        )}
        
        {uploadType === 'youtube' && (
          <YouTubeUpload onUploadSuccess={onUploadSuccess} />
        )}
      </div>
    </Modal>
  );
} 