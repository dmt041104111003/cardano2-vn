"use client";

import { useState, useEffect } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { CommentSkeletonList } from "./CommentSkeleton";
import { useUser } from '~/hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, CommentSectionProps } from '~/constants/comment';
import { useWebSocket } from '~/hooks/useWebSocket';
import { toast } from 'sonner';

function addReplyToNestedReplies(replies: Comment[], newReply: Comment): Comment[] {
  return replies.map(reply => {
    if (reply.id === newReply.parentCommentId && newReply.parentCommentId) {
      return {
        ...reply,
        replies: [...(reply.replies || []), newReply]
      };
    }
    
    if (reply.replies && reply.replies.length > 0) {
      const updatedNestedReplies = addReplyToNestedReplies(reply.replies, newReply);
      if (updatedNestedReplies !== reply.replies) {
        return {
          ...reply,
          replies: updatedNestedReplies
        };
      }
    }
    
    return reply;
  });
}

// function updateNestedReplies(replies: Comment[], updatedComment: Comment): Comment[] {
//   return replies.map(reply => {
//     if (reply.isTemp && updatedComment.id !== reply.id) {
//       return reply;
//     }
//     if (reply.id === updatedComment.id) {
//       return updatedComment;
//     }
    
//     if (reply.replies && reply.replies.length > 0) {
//       const updatedNestedReplies = updateNestedReplies(reply.replies, updatedComment);
//       if (updatedNestedReplies !== reply.replies) {
//         return {
//           ...reply,
//           replies: updatedNestedReplies
//         };
//       }
//     }
    
//     return reply;
//   });
// }

export default function CommentSection({ comments: initialComments, onSubmitComment, showAllComments = true, postId }: CommentSectionProps) {
  const { isAuthenticated, user } = useUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [visibleComments, setVisibleComments] = useState(3);
  const [loading, setLoading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [targetCommentId, setTargetCommentId] = useState<string | null>(null);

  const {
    isConnected,
    isConnecting,
    sendComment,
    sendReply,
    deleteComment,
    updateComment,
  } = useWebSocket({
    postId: postId || '',
    userId: user?.id || '',
    onNewComment: (newComment) => {
      setComments(prev => {
        const exists = prev.some(comment => 
          comment.id === newComment.id || 
          (comment.content === newComment.content && 
           comment.userId === newComment.userId &&
           Math.abs(new Date(comment.createdAt).getTime() - new Date(newComment.createdAt).getTime()) < 5000)
        );
        
        if (exists) {
          return prev;
        }
        
        return [newComment, ...prev];
      });
      
      if (!newComment.isTemp) {
        toast.success('New comment received!');
      }
    },
    onNewReply: (newReply) => {
      setComments(prev => prev.map(comment => {
        if (comment.id === newReply.parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        
        if (comment.replies && comment.replies.length > 0) {
          const updatedReplies = addReplyToNestedReplies(comment.replies, newReply);
          if (updatedReplies !== comment.replies) {
            return {
              ...comment,
              replies: updatedReplies
            };
          }
        }
        
        return comment;
      }));
      if (!newReply.isTemp) {
        toast.success('New reply received!');
      }
    },
    onCommentDeleted: (commentId) => {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.info('Comment deleted');
    },
    onCommentUpdated: (updatedComment) => {
      setComments(prev => prev.map(comment => {
        if (comment.isTemp && updatedComment.id !== comment.id) {
          return comment;
        }
        return comment.id === updatedComment.id ? updatedComment : comment;
      }));
      
      setComments(prev => prev.map(comment => ({
        ...comment,
        replies: comment.replies?.map(reply => {
          if (reply.isTemp && updatedComment.id !== reply.id) {
            return reply;
          }
          return reply.id === updatedComment.id ? updatedComment : reply;
        }) || []
      })));
      
      if (!updatedComment.isTemp) {
        toast.success('Comment updated successfully');
      }
    },
    onError: (error) => {
      toast.error(`WebSocket error: ${error}`);
    },
  });

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
    if (isConnected) {
      const success = sendComment(comment);
      if (success) {
        // Không thêm optimistic comment khi WebSocket connected
        // Chỉ đợi WebSocket broadcast từ server
      } else {
        commentMutation.mutate(comment);
      }
    } else {
      commentMutation.mutate(comment);
    }
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
    if (isConnected) {
      const success = sendReply(replyText, parentId);
      if (success) {
        // Không thêm optimistic reply khi WebSocket connected
        // Chỉ đợi WebSocket broadcast từ server
      } else {
        replyMutation.mutate({ parentId, replyText, userInfo });
      }
    } else {
      replyMutation.mutate({ parentId, replyText, userInfo });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isConnected) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      const success = deleteComment(commentId);
      if (success) {
      } else {
        toast.error('Failed to send delete via WebSocket');
        const commentToRestore = comments.find(c => c.id === commentId);
        if (commentToRestore) {
          setComments(prev => [...prev, commentToRestore]);
        }
      }
    } else {
      toast.error('WebSocket not connected');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (isConnected) {
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content };
        }
        return comment;
      }));
      
      const success = updateComment(commentId, content);
      if (success) {
      } else {
        toast.error('Failed to send update via WebSocket');
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            const originalComment = comments.find(c => c.id === commentId);
            return originalComment || comment;
          }
          return comment;
        }));
      }
    } else {
      toast.error('WebSocket not connected');
    }
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

  // If navigated with a #comment-<id> hash, auto expand parent list so target comment becomes visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#comment-')) return;
    const id = hash.replace('#comment-', '');
    setTargetCommentId(id);

    // Try to reveal more parent comments to ensure visibility
    if (comments.length > 0) {
      setVisibleComments(comments.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments.length]);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <span className={`${isConnected ? 'text-green-600' : isConnecting ? 'text-yellow-600' : 'text-red-600'}`}>
          {isConnected ? 'enabled' : isConnecting ? 'Connecting...' : 'Realtime comments disabled'}
        </span>
      </div>

      {isAuthenticated ? (
        <CommentInput onSubmit={handleSubmitComment} user={{
          id: user?.id || '',
          address: user?.address || '',
          image: user?.image || null,
          isBanned: user?.isBanned || false,
          bannedUntil: user?.bannedUntil || undefined
        }} />
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
                onDeleteComment={handleDeleteComment}
                onUpdateComment={handleUpdateComment}
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