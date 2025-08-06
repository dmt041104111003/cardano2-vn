"use client";

import React from 'react';

interface FormActionsProps {
  isPending: boolean;
}

export default function FormActions({ isPending }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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