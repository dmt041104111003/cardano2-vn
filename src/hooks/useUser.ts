"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { UserHook } from "~/constants/users";

const userCache = new Map<string, { data: UserHook; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserHook | null>(null);
  const [loading, setLoading] = useState(true);
  const lastUpdateRef = useRef<number>(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "loading") return;
      
      const address = session?.user && (session.user as { address?: string }).address;
      const email = session?.user && (session.user as { email?: string }).email;
      
      if (!address && !email) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userIdentifier = address || email;
      const now = Date.now();

      if (userIdentifier) {
        const cached = userCache.get(userIdentifier);
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          setUser(cached.data);
          setLoading(false);
          
          if (now - lastUpdateRef.current > 300000) { 
            lastUpdateRef.current = now;
            
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
            updateTimeoutRef.current = setTimeout(async () => {
              try {
                await fetch("/api/auth/session/update", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              } catch (sessionError) {
                console.error("Error updating session:", sessionError);
              }
            }, 1000);
          }
          return;
        }
      }

      try {
        let url = '';
        if (address) {
          url = `/api/auth/me?address=${encodeURIComponent(address)}`;
        } else if (email) {
          url = `/api/auth/me?email=${encodeURIComponent(email)}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          if (userIdentifier) {
            userCache.set(userIdentifier, { data: data.user, timestamp: now });
          }
          
          if (now - lastUpdateRef.current > 300000) { 
            lastUpdateRef.current = now;
            
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
            updateTimeoutRef.current = setTimeout(async () => {
              try {
                await fetch("/api/auth/session/update", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              } catch (sessionError) {
                console.error("Error updating session:", sessionError);
              }
            }, 1000);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [session, status]);

  return {
    user,
    loading,
    isAuthenticated: !!session,
    isAdmin: user?.isAdmin || false,
  };
} 