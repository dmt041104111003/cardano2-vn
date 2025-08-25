"use client";

import React from 'react';

interface FormActionsProps {
  isPending: boolean;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  onPublishStatusChange: (status: 'DRAFT' | 'PUBLISHED') => void;
}

export default function FormActions({ isPending, publishStatus, onPublishStatusChange }: FormActionsProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <label htmlFor="publishStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Publish Status
        </label>
        <select
          id="publishStatus"
          value={publishStatus}
          onChange={(e) => onPublishStatusChange(e.target.value as 'DRAFT' | 'PUBLISHED')}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          title="Select publish status"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
} 