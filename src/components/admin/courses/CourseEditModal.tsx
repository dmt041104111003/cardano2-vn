import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { CourseEditModalProps } from '~/constants/admin';

export default function CourseEditModal({ 
  course, 
  isOpen, 
  onClose, 
  onSave,
  isSaving
}: CourseEditModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (course) {
      setName(course.name);
    }
  }, [course]);

  const handleSave = () => {
    if (!course || !name.trim()) return;
    onSave(course.id, name.trim());
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Course"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Course Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

                 <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
           <button
             onClick={handleSave}
             disabled={!name.trim() || isSaving}
             className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors font-medium"
           >
             {isSaving ? 'Saving...' : 'Save'}
           </button>
         </div>
      </div>
    </Modal>
  );
} 