"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { CommentSkeletonList } from "./CommentSkeleton";
import { useUser } from '~/hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, CommentSectionProps } from '~/constants/comment';

export default function CommentSection({ comments: initialComments, onSubmitComment, showAllComments = true, postId }: CommentSectionProps) {
  const { isAuthenticated, user } = useUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [visibleComments, setVisibleComments] = useState(3);
  const [loading, setLoading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const commentMutation = useMutation({
    mutationFn: async (comment: string) => {
      if (onSubmitComment) await onSubmitComment(comment);
      return comment;
    },
    onMutate: async (comment: string) => {
      const avatar = user?.image && (user.image.startsWith('http') || user.image.startsWith('data:image')) ? user.image : '';
      const newComment: Comment = {
        id: Math.random().toString(36).slice(2),
        userId: user?.id || '',
        author: user?.address || 'Unknown',
        content: comment,
        createdAt: new Date().toISOString(),
        time: new Date().toISOString(),
        avatar,
        replies: [],
      };
      setComments(prev => [newComment, ...prev]);
      return { previous: comments };
    },
    onError: (err, comment, context) => {
      if (context?.previous) setComments(context.previous);
    },
    onSettled: () => {
    }
  });

  const handleSubmitComment = async (comment: string) => {
    commentMutation.mutate(comment);
  };

  const replyMutation = useMutation({
    mutationFn: async ({ parentId, replyText, userInfo }: { parentId: string, replyText: string, userInfo: { id?: string; address?: string; image?: string } }) => {
      let realPostId = postId;
      if (!realPostId && parentId) {
        const parent = comments.find(c => c.id === parentId);
        if (parent && parent.postId) realPostId = parent.postId;
      }
      if (!realPostId) throw new Error('Cannot determine postId to save reply!');
      await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: realPostId, content: replyText, parentCommentId: parentId }),
      });
      return { parentId, replyText, userInfo };
    },
    onMutate: async ({ parentId, replyText, userInfo }) => {
      const avatar = userInfo?.image && (userInfo.image.startsWith('http') || userInfo.image.startsWith('data:image')) ? userInfo.image : '';
      const newReply: Comment = {
        id: Math.random().toString(36).slice(2),
        userId: userInfo?.id || '',
        author: userInfo?.address || 'Unknown',
        content: replyText,
        createdAt: new Date().toISOString(),
        time: new Date().toISOString(),
        avatar,
        replies: [],
      };
      setComments(prev => prev.map((c: Comment) => c.id === parentId ? { ...c, replies: [...(c.replies || []), newReply] } : c));
      return { previous: comments };
    },
    onError: (err, variables, context) => {
      if (context?.previous) setComments(context.previous);
    },
    onSettled: () => {
    }
  });

  const handleSubmitReply = async (parentId: string, replyText: string, userInfo: { id?: string; address?: string; image?: string }) => {
    replyMutation.mutate({ parentId, replyText, userInfo });
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
        <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/50 text-center text-gray-600 dark:text-gray-400">
          <span>You need to <b>log in</b> to comment.</span>
        </div>
      )}

      <div className="space-y-4">
        {showAllComments && (
          <>
            {visibleCommentsList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onSubmitReply={handleSubmitReply}
                user={{ id: user?.id, address: user?.address, image: user?.image || '' }}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />
            ))}
            {loading && (
              <CommentSkeletonList count={Math.min(3, comments.length - visibleComments)} />
            )}
          </>
        )}
      </div>

      {showAllComments && hasMoreComments && (
        <div className="text-center pt-4">
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium transition-colors hover:underline"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                `Load ${Math.min(3, totalParentComments - visibleComments)} more parent comments`
              )}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {visibleComments} of {totalParentComments} parent comments
            </span>
          </div>
        </div>
      )}

      {showAllComments && !hasMoreComments && comments.length > 0 && (
        <div className="text-center pt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            All {totalParentComments} parent comments loaded
          </span>
        </div>
      )}
    </div>
  );
} 