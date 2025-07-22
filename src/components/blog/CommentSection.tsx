"use client";

import { useState } from "react";
import { Comment } from "../../constants/comments";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { CommentSkeletonList } from "./CommentSkeleton";
import { useUser } from '~/hooks/useUser';

interface CommentSectionProps {
  comments: Comment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const { isAuthenticated, user } = useUser();
  const [visibleComments, setVisibleComments] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = (comment: string) => {
    console.log("New comment:", comment);
  };

  const handleReactionClick = (reaction: string) => {
    console.log(`Reaction clicked: ${reaction}`);
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleComments(prev => Math.min(prev + 3, comments.length));
      setLoading(false);
    }, 1500); 
  };

  const visibleCommentsList = comments.slice(0, visibleComments);
  const hasMoreComments = visibleComments < comments.length;
  const totalParentComments = comments.length;

  return (
    <div className="mt-8 space-y-4">
      {isAuthenticated ? (
        <CommentInput onSubmit={handleSubmitComment} user={user} />
      ) : (
        <div className="bg-gray-800/30 rounded-2xl p-3 border border-gray-700/50 text-center text-gray-400">
          <span>You need to <b>log in</b> to comment.</span>
        </div>
      )}

      <div className="space-y-4">
        {visibleCommentsList.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReaction={handleReactionClick}
          />
        ))}
        {loading && (
          <CommentSkeletonList count={Math.min(3, comments.length - visibleComments)} />
        )}
      </div>

      {hasMoreComments && (
        <div className="text-center pt-4">
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium transition-colors hover:underline"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                `Load ${Math.min(3, totalParentComments - visibleComments)} more parent comments`
              )}
            </button>
            <span className="text-xs text-gray-400">
              Showing {visibleComments} of {totalParentComments} parent comments
            </span>
          </div>
        </div>
      )}

      {!hasMoreComments && comments.length > 0 && (
        <div className="text-center pt-4">
          <span className="text-xs text-gray-400">
            All {totalParentComments} parent comments loaded
          </span>
        </div>
      )}
    </div>
  );
} 