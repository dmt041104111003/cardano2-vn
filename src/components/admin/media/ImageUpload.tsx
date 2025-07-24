'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useToastContext } from '~/components/toast-provider';

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToastContext();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('Invalid file type', 'Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('File too large', 'Please select an image smaller than 5MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccess('Image uploaded', 'Image has been uploaded successfully.');
        onUploadSuccess();
      } else {
        const error = await response.json();
        showError('Upload failed', error.message || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Upload error', 'An error occurred while uploading the image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const input = fileInputRef.current;
        if (input) {
          input.files = files;
          handleFileUpload({ target: { files } } as any);
        }
      } else {
        showError('Invalid file type', 'Please drop an image file.');
      }
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-600 mb-4">
        Drag and drop an image here, or click to select
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-transparent border-2 border-emerald-500 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Select Image'}
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
} 