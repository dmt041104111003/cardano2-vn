"use client";

import { useState, useEffect } from "react";
import { REACTION_DETAILS, REACTION_USERS, REACTION_CONFIG, ReactionUser } from "../../constants/reactions";
import UserItem from "./UserItem";
import UserSkeleton from "./UserSkeleton";

interface ReactionPopupProps {
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  onClose: () => void;
}

export default function ReactionPopup({ reactions, onClose }: ReactionPopupProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [visibleUsers, setVisibleUsers] = useState(REACTION_CONFIG.initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const allUsers = REACTION_USERS;

  const getFilteredUsers = () => {
    let filteredUsers = allUsers;
    if (selectedTab !== 'all') {
      const reactionMap = {
        like: "👍",
        love: "❤️", 
        haha: "😂",
        wow: "😮",
        sad: "😢",
        angry: "😠"
      };
      filteredUsers = allUsers.filter(user => user.reaction === reactionMap[selectedTab as keyof typeof reactionMap]);
    }
    return filteredUsers.slice(0, visibleUsers);
  };

  const handleLoadMoreUsers = () => {
    setLoadingUsers(true);
    setTimeout(() => {
      setVisibleUsers(prev => Math.min(prev + REACTION_CONFIG.loadMoreCount, allUsers.length));
      setLoadingUsers(false);
    }, REACTION_CONFIG.loadingDelay);
  };

  const hasMoreUsers = visibleUsers < allUsers.length;

  useEffect(() => {
    setVisibleUsers(REACTION_CONFIG.initialUsers);
    setLoadingUsers(false);
  }, [selectedTab]);

  const reactionDetails = REACTION_DETAILS.map((detail) => ({
    ...detail,
    count: reactions?.[detail.type as keyof typeof reactions] || 0
  }));

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTab('all')}
              className={`font-semibold pb-1 transition-colors ${
                selectedTab === 'all' 
                  ? 'text-blue-500 border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <div className="flex items-center gap-3">
              {reactionDetails.map((reaction) => (
                <button
                  key={reaction.type}
                  onClick={() => setSelectedTab(reaction.type)}
                  className={`flex items-center gap-1 transition-colors ${
                    selectedTab === reaction.type 
                      ? 'text-blue-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{reaction.icon}</span>
                  <span className="text-white font-semibold">{reaction.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close reaction details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {getFilteredUsers().map((user: ReactionUser) => (
            <UserItem key={user.id} user={user} />
          ))}

          {hasMoreUsers && !loadingUsers && (
            <div className="p-4 border-t border-gray-700/50">
              <button
                onClick={handleLoadMoreUsers}
                className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Load {Math.min(REACTION_CONFIG.loadMoreCount, allUsers.length - visibleUsers)} more users
              </button>
            </div>
          )}

          {loadingUsers && (
            <UserSkeleton count={Math.min(REACTION_CONFIG.loadMoreCount, allUsers.length - visibleUsers)} />
          )}
        </div>
      </div>
    </div>
  );
} 