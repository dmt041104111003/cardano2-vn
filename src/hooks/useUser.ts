"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
  isAdmin: boolean;
  address: string;
}

export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "loading") return;
      
      const address = session?.user && (session.user as { address?: string }).address;
      if (!address) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const url = `/api/auth/me?address=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
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
  }, [session, status]);

  return {
    user,
    loading,
    isAuthenticated: !!session,
    isAdmin: user?.isAdmin || false,
  };
} 