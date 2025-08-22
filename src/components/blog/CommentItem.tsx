"use client";

import { useState, useRef, useEffect } from "react";

import { ReplySkeleton } from "./CommentSkeleton";

import { useToastContext } from "../toast-provider";
import { EMOJIS } from "../../constants/emoji";
import { useUser } from '~/hooks/useUser';
import Modal from '../admin/common/Modal';
import { Comment, CommentItemProps, MAX_COMMENT_LENGTH } from '~/constants/comment';


const formatTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CommentItem({ comment, onSubmitReply, onDeleteComment, onUpdateComment, user, activeReplyId, setActiveReplyId, depth = 0, hoveredId, setHoveredId }: CommentItemProps) {
  const [replyText, setReplyText] = useState("");
  const [visibleReplies, setVisibleReplies] = useState(2);
  const [expandedComment, setExpandedComment] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const { showSuccess, showError } = useToastContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiClick = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const { isAuthenticated, user: currentUser } = useUser();
  const [deleted, setDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const canEdit = currentUser && currentUser.id === comment.userId;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        if (comment.replies && comment.replies.length > 0) {
          setVisibleReplies(comment.replies.length);
        }
        if (hash === `#comment-${comment.id}`) {
          setExpandedComment(true);
        }
      }
    }
  }, [comment.id]);

  const handleEdit = () => {
    setEditText(comment.content);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditText(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      showError('Content cannot be empty');
      return;
    }
    
    if (onUpdateComment) {
      try {
        await onUpdateComment(comment.id, editText);
        setEditing(false);
      } catch (error) {
        showError('Update error', 'An error occurred while updating the comment.');
      }
    } else {
      showError('Update error', 'WebSocket not available for update.');
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (replyText.trim()) {
      await onSubmitReply(commentId, replyText, user || {});
      setReplyText("");
      setActiveReplyId(null);
    }
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      showError('You need to sign in to reply to a comment!');
      return;
    }
    setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
    if (activeReplyId !== comment.id) {
      if (comment.userId) {
        setReplyText(`@${shortAddress(comment.userId)} `);
      } else {
        setReplyText("");
      }
    } else {
      setReplyText("");
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
      return <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{content}</p>;
    }

    return (
      <div>
        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
          {expandedComment ? content : `${content.substring(0, MAX_COMMENT_LENGTH)}...`}
        </p>
        <button
          onClick={toggleCommentExpansion}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-1"
        >
          {expandedComment ? "Show less" : "Show more"}
        </button>
      </div>
    );
  };


  const shortAddress = (addr: string) => addr.length > 16 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;

  const isHoveredReply = hoveredId === comment.id && !!comment.parentCommentId;
  const isParentHighlight = hoveredId && hoveredId === comment.parentCommentId;
  // Avatar logic
  const avatarUrl =
    (comment.user?.image && (comment.user.image.startsWith('http') || comment.user.image.startsWith('data:image')))
      ? comment.user.image
      : (comment.avatar && (comment.avatar.startsWith('http') || comment.avatar.startsWith('data:image')))
        ? comment.avatar
        : '';
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);


  const maxIndentMobile = 8; 
  const maxIndentDesktop = 12; 
  const indentMobile = Math.min((depth + 1) * 4, maxIndentMobile);
  const indentDesktop = Math.min((depth + 1) * 6, maxIndentDesktop); 

  const canDelete = currentUser && (currentUser.role === 'ADMIN' || currentUser.id === comment.userId);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    
    if (onDeleteComment) {
      try {
        await onDeleteComment(comment.id);
        setDeleted(true);
      } catch (error) {
        showError('Delete error', 'An error occurred while deleting the comment.');
      }
    } else {
      showError('Delete error', 'WebSocket not available for delete.');
    }
  };

  if (deleted) return null;

  return (
    <div
      id={`comment-${comment.id}`}
      className={comment.parentCommentId ? `relative ml-[${indentMobile}px] md:ml-[${indentDesktop}px]` : ''}
      style={{ maxWidth: '100%' }}
      onMouseEnter={() => setHoveredId && setHoveredId(comment.id)}
      onMouseLeave={() => setHoveredId && setHoveredId(null)}
    >
      {comment.parentCommentId && (
        <div className="absolute left-0 top-0 h-full flex items-stretch" style={{width: '16px'}}>
          <div className={`border-l-2 h-full ml-2 transition-colors duration-200 ${isHoveredReply ? 'border-blue-500 dark:border-blue-400' : 'border-gray-300 dark:border-gray-700'}`}></div>
        </div>
      )}
      <div className={comment.parentCommentId ? 'pl-2 md:pl-4 w-full max-w-full' : 'w-full max-w-full'}>
        <div className={`space-y-3 transition-colors duration-200 ${isParentHighlight ? 'bg-blue-100/50 dark:bg-blue-900/30' : ''}`} style={{wordBreak: 'break-word'}}>
          <div className="flex items-start gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${comment.avatar || 'from-blue-500 to-purple-600'} flex-shrink-0`}></div>
            )}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-semibold text-gray-900 dark:text-white text-xs font-mono cursor-pointer select-all"
                    title="Copy userId"
                    onClick={() => {
                      navigator.clipboard.writeText(comment.userId || '');
                      showSuccess('Copied!');
                    }}
                  >
                    {shortAddress(comment.userId || '')}
                  </span>
                  <span
                    className="font-mono text-blue-700 dark:text-blue-300 text-xs bg-blue-100/40 dark:bg-blue-900/40 px-2 py-0.5 rounded select-all cursor-pointer hover:text-blue-800 dark:hover:text-blue-200"
                    title="Copy address"
                    onClick={() => {
                      navigator.clipboard.writeText(comment.author || '');
                      showSuccess('Copied!');
                    }}
                  >
                    {shortAddress(comment.author || '')}
                  </span>
                  {comment.isPostAuthor && (
                    <span className="ml-2 italic font-bold text-blue-600 dark:text-blue-500 text-xs">author</span>
                  )}
           

                </div>
                {editing ? (
                <div className="mt-2 flex flex-col gap-2">
                  <textarea
                    className="w-full rounded-xl bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 p-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={3}
                    placeholder="Enter your comment..."
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : renderCommentContent(comment.content)}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <button 
                  onClick={handleReplyClick}
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
                >
                  Reply
                </button>
                {canEdit && !editing && (
                  <button
                    onClick={handleEdit}
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 text-yellow-600 dark:text-yellow-300 transition-colors font-medium ml-2"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="hover:text-red-600 dark:hover:text-red-400 text-red-600 dark:text-red-300 transition-colors font-medium ml-2"
                    >
                      Delete
                    </button>
                    <Modal
                      isOpen={showDeleteModal}
                      onClose={() => setShowDeleteModal(false)}
                      title="Delete comment confirmation"
                    >
                      <div className="space-y-4">
                        <p>Are you sure you want to delete this comment?</p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Modal>
                  </>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{formatTime(comment.time || '')}</span>
              </div>
            </div>
          </div>

          {activeReplyId === comment.id && (
            <div className="ml-11">
              <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/50">
                <div className="flex items-start gap-3">
                  {user?.image ? (
                    <img src={user.image} alt="avatar" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full rounded-xl bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 pl-4 pr-10 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                          autoFocus
                        />
   
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker && setShowEmojiPicker((v: boolean) => !v)}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors p-1"
                          title="Add emoji"
                          tabIndex={-1}
                          ref={emojiButtonRef}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          type="submit"
                          disabled={!replyText.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors p-1"
                          aria-label="Send reply"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </button>
                        {showEmojiPicker && (
                          <div
                            className="absolute z-50 right-10 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg"
                            ref={emojiPickerRef}
                          >
                            <div className="grid grid-cols-8 gap-1">
                              {EMOJIS.map((emoji: string, index: number) => (
                                <button
                                  key={index}
                                  onClick={() => handleEmojiClick && handleEmojiClick(emoji)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-lg"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
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
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onSubmitReply={onSubmitReply}
                  onDeleteComment={onDeleteComment}
                  onUpdateComment={onUpdateComment}
                  user={user}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  depth={depth + 1}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                />
              ))}

              {comment.replies.length > visibleReplies && !loadingReplies && (
                <div>
                  <button
                    onClick={loadMoreReplies}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
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


            </div>
          )}
        </div>
      </div>
    </div>
  );
} 