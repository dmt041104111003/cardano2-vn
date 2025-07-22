"use client";

import { useState } from "react";
import ReactionPopup from './ReactionPopup';

interface ReactionCountProps {
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
}

export default function ReactionCount({ reactions }: ReactionCountProps) {
  const [showDetails, setShowDetails] = useState(false);
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  
  const topReactions = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (totalReactions === 0) return null;

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-4 text-lg text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex -space-x-2">
          {topReactions.map(([type], index) => {
            const icons = {
              like: "👍",
              love: "❤️",
              haha: "😂",
              wow: "😮",
              sad: "😢",
              angry: "😠"
            };

            return (
              <div
                key={type}
                className="h-12 w-12 rounded-full bg-transparent border border-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
                style={{ zIndex: topReactions.length - index }}
              >
                <span className="text-lg">{icons[type as keyof typeof icons]}</span>
              </div>
            );
          })}
        </div>
        
        <span className="text-gray-400 font-medium text-lg">
          {totalReactions} {totalReactions === 1 ? 'person' : 'people'} like this
        </span>
      </div>


      {showDetails && (
        <ReactionPopup 
          reactions={reactions}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
} 