"use client";

import { useState } from "react";
import { Comment } from "../../constants/comments";
import ReactionCount from "./ReactionCount";
import CommentReply from "./CommentReply";
import { ReplySkeleton } from "./CommentSkeleton";

const MAX_COMMENT_LENGTH = 200;

interface CommentItemProps {
  comment: Comment;
  onReaction: (reaction: string) => void;
}

export default function CommentItem({ comment, onReaction }: CommentItemProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(2);
  const [expandedComment, setExpandedComment] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (replyText.trim()) {
      console.log(`Reply to ${commentId}:`, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  const toggleRepliesExpansion = () => {
    setExpandedReplies(!expandedReplies);
    if (!expandedReplies) {
      setVisibleReplies(comment.replies?.length || 0);
    } else {
      setVisibleReplies(2);
    }
  };

  const loadMoreReplies = () => {
    setLoadingReplies(true);
    setTimeout(() => {
      const currentVisible = visibleReplies;
      setVisibleReplies(Math.min(currentVisible + 3, comment.replies?.length || 0));
      setLoadingReplies(false);
    }, 1000);
  };

  const toggleCommentExpansion = () => {
    setExpandedComment(!expandedComment);
  };

  const renderCommentContent = (content: string) => {
    const shouldTruncate = content.length > MAX_COMMENT_LENGTH;
    
    if (!shouldTruncate) {
      return <p className="text-gray-200 text-sm leading-relaxed">{content}</p>;
    }

    return (
      <div>
        <p className="text-gray-200 text-sm leading-relaxed">
          {expandedComment ? content : `${content.substring(0, MAX_COMMENT_LENGTH)}...`}
        </p>
        <button
          onClick={toggleCommentExpansion}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-1"
        >
          {expandedComment ? "Show less" : "Show more"}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${comment.avatar} flex-shrink-0`}></div>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-800/30 rounded-2xl px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm">{comment.author}</span>
              <span className="text-xs text-gray-400">{comment.time}</span>
            </div>
            {renderCommentContent(comment.content)}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <div className="relative">
              <button 
                className="hover:text-blue-400 transition-colors font-medium"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                Like
              </button>
              {showReactions && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 z-10 p-1">
                  <div className="flex items-center gap-3 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-full px-6 py-4 shadow-2xl">
                    {[
                      { emoji: "👍", label: "Like", color: "bg-blue-500" },
                      { emoji: "❤️", label: "Love", color: "bg-red-500" },
                      { emoji: "😂", label: "Haha", color: "bg-yellow-500" },
                      { emoji: "😮", label: "Wow", color: "bg-yellow-500" },
                      { emoji: "😢", label: "Sad", color: "bg-yellow-500" },
                      { emoji: "😠", label: "Angry", color: "bg-red-500" },
                    ].map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => onReaction(reaction.label)}
                        className="w-14 h-14 rounded-full bg-transparent hover:bg-gray-700/50 hover:scale-125 transition-all duration-200 flex items-center justify-center text-white text-3xl group relative overflow-hidden"
                        aria-label={reaction.label}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          {reaction.emoji}
                        </span>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleReplyClick(comment.id)}
              className="hover:text-gray-300 transition-colors font-medium"
            >
              Reply
            </button>
            <ReactionCount reactions={comment.reactions} />
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-11">
          <div className="bg-gray-800/30 rounded-2xl p-3 border border-gray-700/50">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
              <div className="flex-1">
                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="w-full rounded-xl bg-gray-700/50 border border-gray-600/50 px-12 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                      autoFocus
                    />
                    
                    <button 
                      type="submit"
                      disabled={!replyText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors p-1"
                      aria-label="Send reply"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-yellow-400 transition-colors p-1"
                      title="Add emoji"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-green-400 transition-colors p-1"
                      title="Add photo"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                      title="Add file"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-purple-400 transition-colors p-1"
                      title="Add GIF"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-yellow-400 transition-colors p-1"
                      title="Favorite"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3">
          {comment.replies.slice(0, visibleReplies).map((reply) => (
            <CommentReply
              key={reply.id}
              reply={reply}
              onReply={handleReplyClick}
              onReaction={onReaction}
              replyingTo={replyingTo}
              onSubmitReply={handleSubmitReply}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))}

          {comment.replies.length > visibleReplies && !loadingReplies && (
            <div>
              <button
                onClick={loadMoreReplies}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Load {Math.min(3, comment.replies.length - visibleReplies)} more replies
              </button>
            </div>
          )}


          {loadingReplies && (
            <div className="space-y-3">
              {Array.from({ length: Math.min(3, comment.replies.length - visibleReplies) }).map((_, index) => (
                <ReplySkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}

          {comment.replies.length > 3 && !expandedReplies && (
            <div>
              <button
                onClick={toggleRepliesExpansion}
                className="text-gray-400 hover:text-gray-300 text-sm font-medium"
              >
                View all {comment.replies.length} replies
              </button>
            </div>
          )}

          {expandedReplies && (
            <div>
              <button
                onClick={toggleRepliesExpansion}
                className="text-gray-400 hover:text-gray-300 text-sm font-medium"
              >
                Hide replies
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 