'use client';

import { useState, useRef } from 'react';
import { useToastContext } from '~/components/toast-provider';
import { ImageUploadProps } from '~/constants/media';

export function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null);
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
    setIsUploading(true);
    setPreview(null);
    setUploadedUrl(null);
    setCloudinaryPublicId(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('ImageUpload response:', result);
      
      if (response.ok && result.data?.media?.url) {
        setPreview(result.data.media.url);
        setUploadedUrl(result.data.media.url);
        setCloudinaryPublicId(result.data.media.public_id || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        console.error('Upload failed:', result);
        showError('Upload failed', result.error || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Upload error', 'An error occurred while uploading the image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!uploadedUrl) return;
    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadedUrl, type: 'IMAGE', public_id: cloudinaryPublicId }),
      });
      if (response.ok) {
        showSuccess('Image saved', 'Image has been saved to the media library.');
        setPreview(null);
        setUploadedUrl(null);
        setCloudinaryPublicId(null);
        onUploadSuccess();
      } else {
        const errJson = await response.json();
        showError('Save failed', errJson.message || 'Failed to save image.');
      }
    } catch {
      showError('Save error', 'An error occurred while saving the image.');
    } finally {
      setIsUploading(false);
    }
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
        {uploadedUrl && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {isUploading ? 'Saving...' : 'Save'}
          </button>
        )}
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