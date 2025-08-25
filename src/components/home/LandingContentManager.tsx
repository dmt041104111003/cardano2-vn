"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import LandingContentManager from '~/components/admin/landing-content/LandingContentManager';

interface LandingContentManagerWrapperProps {
  formData: {
    section: string;
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
    media1Url: string;
    media2Url: string;
    media3Url: string;
    media4Url: string;
    publishStatus: 'DRAFT' | 'PUBLISHED';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    section: string;
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
    media1Url: string;
    media2Url: string;
    media3Url: string;
    media4Url: string;
    publishStatus: 'DRAFT' | 'PUBLISHED';
  }>>;
}

export default function LandingContentManagerWrapper({ formData, setFormData }: LandingContentManagerWrapperProps) {
  const { data: session } = useSession();

  const { data: userData } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      if (!session?.user) {
        return null;
      }
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/user', window.location.origin);
      if (sessionUser.address) url.searchParams.set('address', sessionUser.address);
      if (sessionUser.email) url.searchParams.set('email', sessionUser.email);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }
      return response.json();
    },
    enabled: !!session?.user,
  });

  const isAdmin = userData?.data?.role?.name === 'ADMIN';
 

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-lg font-medium">Access Denied</p>
          <p className="text-sm">You need admin privileges to manage landing content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Landing Content Management
      </h3>
      <LandingContentManager formData={formData} setFormData={setFormData} />
    </div>
  );
} 