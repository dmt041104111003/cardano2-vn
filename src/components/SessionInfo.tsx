"use client";

import { useUser } from "~/hooks/useUser";
import { useEffect, useState, useCallback } from "react";
import { SessionData } from '~/constants/users';

export default function SessionInfo() {
  const { user, isAuthenticated } = useUser();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSessionInfo = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/auth/session/info");
      if (response.ok) {
        const data = await response.json();
        setSessionData(data.session);
      }
    } catch (error) {
      console.error("Error fetching session info:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchSessionInfo();
  }, [fetchSessionInfo]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-white mb-2">Session Information</h3>
      {loading ? (
        <p className="text-gray-400 text-xs">Loading session info...</p>
      ) : sessionData ? (
        <div className="space-y-1 text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Session ID:</span> {sessionData.id}
          </div>
          <div>
            <span className="text-gray-400">First Access:</span> {formatDate(sessionData.accessTime)}
          </div>
          <div>
            <span className="text-gray-400">Last Access:</span> {formatDate(sessionData.lastAccess)}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-xs">No session data available</p>
      )}
    </div>
  );
} 