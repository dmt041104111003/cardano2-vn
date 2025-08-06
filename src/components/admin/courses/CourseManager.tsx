"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import { CourseTable } from './CourseTable';
import { Pagination } from '~/components/ui/pagination';
import { Course } from '~/constants/admin';
import MediaInput from '~/components/ui/media-input';

import CourseEditModal from './CourseEditModal';

export default function CourseManager() {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    }
  });



  const createMutation = useMutation({
    mutationFn: async ({ name, image }: { name: string; image?: string }) => {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setNewName('');
      setNewImage('');
      showSuccess('Course created successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, image }: { id: string; name: string; image?: string }) => {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditingCourse(null);
      showSuccess('Course updated successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showSuccess('Course deleted successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showError('Name is required');
      return;
    }
    
    const isDuplicate = courses?.some(
      (course: Course) => course.name.toLowerCase() === newName.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Course with this name already exists');
      return;
    }
    
    createMutation.mutate({ name: newName.trim(), image: newImage });
  };

  const handleMediaSelect = (media: { id: string; url: string; type: string }) => {
    setNewImage(media.url);
  };

  const handleUpdate = (id: string, name: string, image?: string) => {
    if (!name.trim()) {
      showError('Name is required');
      return;
    }
    
    const isDuplicate = courses?.some(
      (course: Course) => 
        course.id !== id && 
        course.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Course with this name already exists');
      return;
    }
    
    updateMutation.mutate({ id, name: name.trim(), image });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const startEditing = (course: Course) => {
    setEditingCourse(course);
  };

  const filteredCourses = useMemo(() => {
    return courses?.filter((course: Course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [courses, searchTerm]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter course name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors font-medium"
            >
              {createMutation.isPending ? 'Adding...' : 'Add'}
            </button>
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

       <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
                     <CourseTable
             courses={paginatedCourses}
             onEdit={startEditing}
             onDelete={handleDelete}
             
           />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCourses.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
                 </div>
       </div>

       

       <CourseEditModal
         course={editingCourse}
         isOpen={!!editingCourse}
         onClose={() => setEditingCourse(null)}
         onSave={handleUpdate}
         isSaving={updateMutation.isPending}
       />
     </div>
   );
} 