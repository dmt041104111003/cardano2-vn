"use client";

import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import EventLocationManager from '~/components/admin/event-locations/EventLocationManager';
import CourseManager from '~/components/admin/courses/CourseManager';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in ContactFormManager:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="text-red-800 dark:text-red-200 font-medium">Something went wrong</h3>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            Please refresh the page or try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    queryKey: ['user-role'],
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
    enabled: !!session?.user
  });

  const isAdmin = userData?.role === 'ADMIN';



  if (isLoadingUser) {
    console.log('ContactFormManager: Loading user data...');
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    console.log('ContactFormManager: User is not admin');
    return null; 
  }

  console.log('ContactFormManager: Rendering admin interface');

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Event Locations
            </h3>
            <ErrorBoundary>
              <EventLocationManager />
            </ErrorBoundary>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Courses
            </h3>
            <ErrorBoundary>
              <CourseManager />
            </ErrorBoundary>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default React.memo(ContactFormManager); 