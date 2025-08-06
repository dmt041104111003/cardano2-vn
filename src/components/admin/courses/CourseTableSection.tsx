"use client";

import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import { CourseTable } from './CourseTable';
import { Pagination } from '~/components/ui/pagination';
import { Course } from '~/constants/admin';
import CourseEditModal from './CourseEditModal';

interface CourseTableSectionProps {
  courses?: Course[];
  onSuccess?: () => void;
}

export default function CourseTableSection({ courses = [], onSuccess }: CourseTableSectionProps) {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, image, title, description }: { id: string; name: string; image?: string; title?: string; description?: string }) => {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, title, description })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['contact-courses'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-courses'] });
      setEditingCourse(null);
      showSuccess('Course updated successfully');
      onSuccess?.();
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
      queryClient.invalidateQueries({ queryKey: ['contact-courses'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-courses'] });
      showSuccess('Course deleted successfully');
      onSuccess?.();
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleUpdate = (id: string, name: string, image?: string, title?: string, description?: string) => {
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
    
    updateMutation.mutate({ id, name: name.trim(), image, title, description });
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

  return (
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
