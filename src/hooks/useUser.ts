"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserHook } from "~/constants/users";

const userCache = new Map<string, { data: UserHook; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserHook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "loading") return;
      
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const sessionUser = session.user as { 
        address?: string; 
        email?: string; 
        name?: string; 
        image?: string; 
      };
      
      const userIdentifier = sessionUser.address || sessionUser.email;
      const now = Date.now();

      if (userIdentifier) {
        const cached = userCache.get(userIdentifier);
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          setUser(cached.data);
          setLoading(false);
          return;
        }
      }

      try {
        const params = new URLSearchParams();
        if (sessionUser.address) {
          params.set('address', sessionUser.address);
        } else if (sessionUser.email) {
          params.set('email', sessionUser.email);
        }
        
        const response = await fetch(`/api/user?${params}`);
        if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data;
        const userData: UserHook = {
          id: data.id,
          name: data.name || sessionUser.name || null,
          email: data.email || sessionUser.email || undefined,
          address: data.wallet || sessionUser.address || '',
          image: data.image || sessionUser.image || null,
          role: data.role?.name || 'USER',
          isAdmin: data.role?.name === "ADMIN",
          isBanned: data.isBanned || false,
          bannedUntil: data.bannedUntil || undefined
        };
          
          setUser(userData);
          
          if (userIdentifier) {
            userCache.set(userIdentifier, { data: userData, timestamp: now });
          }
        } else {
          const userData: UserHook = {
            id: userIdentifier || '',
            name: sessionUser.name || null,
            email: sessionUser.email || undefined, 
            address: sessionUser.address || '',
            image: sessionUser.image || null,
            role: 'USER',
            isAdmin: false
          };
          setUser(userData);
        }
      } catch (error) {
        const userData: UserHook = {
          id: userIdentifier || '',
          name: sessionUser.name || null,
          email: sessionUser.email || undefined,
          address: sessionUser.address || '',
          image: sessionUser.image || null,
          role: 'USER',
          isAdmin: false
        };
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, status]);

  return {
    user,
    loading,
    isAuthenticated: !!session,
    isAdmin: user?.isAdmin || false,
  };
} 