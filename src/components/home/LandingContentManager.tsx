"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import LandingContentManager from '~/components/admin/landing-content/LandingContentManager';

export default function LandingContentManagerWrapper() {
  const { data: session } = useSession();

  const { data: userData } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      if (!session?.user) {
        return null;
      }
      const sessionUser = session.user as { address?: string; email?: string };
      const url = new URL('/api/auth/me', window.location.origin);
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

  const isAdmin = userData?.user?.role === 'ADMIN';

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Landing Content Management
      </h3>
      <LandingContentManager />
    </div>
  );
} 