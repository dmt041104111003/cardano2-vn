"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import EventLocationForm from './EventLocationForm';
import EventLocationTableSection from './EventLocationTableSection';

export default function EventLocationManager() {
  const { data: eventLocations, isLoading } = useQuery({
    queryKey: ['admin-event-locations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/event-locations');
      if (!response.ok) {
        throw new Error('Failed to fetch event locations');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="overflow-hidden">
            <div className="min-w-full">
              <div className="bg-gray-50 dark:bg-gray-800">
                <div className="px-6 py-3">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EventLocationForm eventLocations={eventLocations} />
      <EventLocationTableSection eventLocations={eventLocations} />
    </div>
  );
} 