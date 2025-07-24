'use client';

import { useState, useRef } from 'react';
import { useToastContext } from '~/components/toast-provider';

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToastContext();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setIsUploading(true);
      const formData = new FormData();
      formData.append('url', dataUrl);
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          showSuccess('Image uploaded', 'Image has been uploaded successfully.');
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          onUploadSuccess();
        } else {
          const errJson = await response.json();
          showError('Upload failed', errJson.message || 'Failed to upload image.');
        }
      } catch {
        showError('Upload error', 'An error occurred while uploading the image.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="media-upload-input" className="block text-sm font-medium text-gray-700 mb-1">Select image file</label>
        <input
          id="media-upload-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          title="Select image file to upload"
          placeholder="Choose image file..."
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-transparent border-2 border-emerald-500 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Select Image'}
        </button>
      </div>
      {preview && (
        <div className="flex justify-center mt-2">
          <img src={preview} alt="Preview" className="max-h-48 rounded shadow" />
        </div>
      )}
      <p className="text-xs text-gray-500">
        Only images up to 5MB. Supported formats: JPG, PNG, GIF, WebP, SVG.
      </p>
    </div>
  );
} 