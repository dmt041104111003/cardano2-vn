'use client';

import { Plus } from 'lucide-react';
import { AdminHeaderProps } from '~/constants/admin';

export function AdminHeader({ title, description, buttonText, onAddClick }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>
      <button 
        onClick={onAddClick}
        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-300 bg-white/60 text-blue-700 text-sm font-semibold shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-150"
      >
        <Plus className="h-4 w-4" />
        {buttonText}
      </button>
    </div>
  );
} 