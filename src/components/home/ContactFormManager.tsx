"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import EventLocationManager from '~/components/admin/event-locations/EventLocationManager';
import CourseManager from '~/components/admin/courses/CourseManager';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ContactFormManager() {
  const { data: session } = useSession();

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-role', session?.user?.email, (session?.user as any)?.address],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/auth/me', window.location.origin);
      if (sessionUser.address) url.searchParams.set('address', sessionUser.address);
      if (sessionUser.email) url.searchParams.set('email', sessionUser.email);

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    },
    enabled: !!session?.user,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isAdmin = userData?.role === 'ADMIN';

  if (isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Event Locations
        </h3>
        <EventLocationManager />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Courses
        </h3>
        <CourseManager />
      </div>
    </div>
  );
}

export default ContactFormManager; 