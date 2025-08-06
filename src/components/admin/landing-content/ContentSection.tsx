"use client";

import React from 'react';
import { LandingContentFormData } from '~/constants/admin';

interface ContentSectionProps {
  formData: LandingContentFormData;
  setFormData: React.Dispatch<React.SetStateAction<LandingContentFormData>>;
}

export default function ContentSection({ formData, setFormData }: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
        Content
      </h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter subtitle"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="mainText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Main Text
            </label>
            <textarea
              id="mainText"
              value={formData.mainText}
              onChange={(e) => setFormData({ ...formData, mainText: e.target.value })}
              placeholder="Enter main text..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sub Text
            </label>
            <textarea
              id="subText"
              value={formData.subText}
              onChange={(e) => setFormData({ ...formData, subText: e.target.value })}
              placeholder="Enter sub text..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 