import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { EventLocationEditModalProps } from '~/constants/admin';

export default function EventLocationEditModal({ 
  eventLocation, 
  isOpen, 
  onClose, 
  onSave,
  isSaving
}: EventLocationEditModalProps) {
  const [name, setName] = useState('');
  const [publishStatus, setPublishStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  useEffect(() => {
    if (eventLocation) {
      setName(eventLocation.name);
      setPublishStatus(eventLocation.publishStatus || 'DRAFT');
    }
  }, [eventLocation]);

  const handleSave = () => {
    if (!eventLocation || !name.trim()) return;
    onSave(eventLocation.id, name.trim(), publishStatus);
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Event Location"
      maxWidth="max-w-md"
    >
             <div className="space-y-6">
         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Event Location Name
           </label>
           <input
             type="text"
             value={name}
             onChange={(e) => setName(e.target.value)}
             placeholder="Enter event location name"
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Publish Status
           </label>
           <select
             value={publishStatus}
             onChange={(e) => setPublishStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
             title="Select publish status"
           >
             <option value="DRAFT">Draft</option>
             <option value="PUBLISHED">Published</option>
           </select>
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