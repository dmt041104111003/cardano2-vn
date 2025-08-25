"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import MediaInput from '~/components/ui/media-input';
import { Course } from '~/constants/admin';

interface CourseFormProps {
  courses?: Course[];
  onSuccess?: () => void;
}

export default function CourseForm({ courses = [], onSuccess }: CourseFormProps) {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [publishStatus, setPublishStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const createMutation = useMutation({
    mutationFn: async ({ name, image, title, description, publishStatus }: { name: string; image?: string; title?: string; description?: string; publishStatus: 'DRAFT' | 'PUBLISHED' }) => {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, title, description, publishStatus })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['contact-courses'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-courses'] });
      setNewName('');
      setNewImage('');
      setNewTitle('');
      setNewDescription('');
      setPublishStatus('DRAFT');
      showSuccess('Course created successfully');
      onSuccess?.();
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showError('Course name is required');
      return;
    }
    
    const isDuplicate = courses?.some(
      (course: Course) => course.name.toLowerCase() === newName.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Course with this name already exists');
      return;
    }
    
    createMutation.mutate({ name: newName.trim(), image: newImage, title: newTitle.trim(), description: newDescription.trim(), publishStatus: publishStatus });
  };

  const handleMediaSelect = (media: { id: string; url: string; type: string }) => {
    setNewImage(media.url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={handleCreate} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter course name"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={publishStatus}
            onChange={(e) => setPublishStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Select publish status"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
          >
            {createMutation.isPending ? 'Adding...' : 'Add'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Course title (optional)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Course description (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Image (Optional)
          </label>
          <MediaInput
            onMediaAdd={handleMediaSelect}
            mediaType="image"
          />
          {newImage && (
            <div className="mt-2">
              <img
                src={newImage}
                alt="Selected course image"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
