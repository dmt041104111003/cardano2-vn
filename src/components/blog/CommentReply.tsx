"use client";

import { useState, useRef } from "react";

import { EMOJIS } from "../../constants/emoji";
import { Comment, CommentReplyProps, MAX_COMMENT_LENGTH } from '~/constants/comment';

export default function CommentReply({ 
  reply, 
  onReply, 
  replyingTo, 
  onSubmitReply, 
  replyText, 
  setReplyText, 
  user 
}: CommentReplyProps) {
  const [expandedReply, setExpandedReply] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const handleEmojiClick = (emoji: string) => {
    setReplyText(replyText + emoji);
    setShowEmojiPicker(false);
  };

  const toggleReplyExpansion = () => {
    setExpandedReply(!expandedReply);
  };

  const renderReplyContent = (content: string) => {
    const shouldTruncate = content.length > MAX_COMMENT_LENGTH;
    
    if (!shouldTruncate) {
      return <p className="text-gray-200 text-sm leading-relaxed">{content}</p>;
    }

    return (
      <div>
        <p className="text-gray-200 text-sm leading-relaxed">
          {expandedReply ? content : `${content.substring(0, MAX_COMMENT_LENGTH)}...`}
        </p>
        <button
          onClick={toggleReplyExpansion}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-1"
        >
          {expandedReply ? "Show less" : "Show more"}
        </button>
      </div>
    );
  };

  const formatTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };
  const shortAddress = (addr: string) => addr.length > 16 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;

  const avatarUrl =
    (reply.user?.image && (reply.user.image.startsWith('http') || reply.user.image.startsWith('data:image')))
      ? reply.user.image
      : (reply.avatar && (reply.avatar.startsWith('http') || reply.avatar.startsWith('data:image')))
        ? reply.avatar
        : '';

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${reply.avatar || 'from-blue-500 to-purple-600'} flex-shrink-0`}></div>
        )}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-800/20 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 mb-1">

              {!reply.user?.displayName && !reply.author && (
                <span className="font-semibold text-white text-xs">UserID: {reply.userId}</span>
              )}

              {(reply.user?.displayName || reply.author) && (
                <span
                  className="font-mono text-blue-300 text-xs bg-blue-900/40 px-2 py-0.5 rounded select-all cursor-pointer hover:text-blue-200"
                  title="Copy name/address"
                  onClick={() => {navigator.clipboard.writeText(reply.user?.displayName || reply.author || '')}}
                >
                  {shortAddress(reply.user?.displayName || reply.author || '')}
                </span>
              )}
            </div>
            {renderReplyContent(reply.content)}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
 
            <button 
              onClick={() => {
                const displayName = reply.user?.displayName || reply.author || reply.userId;
                onReply(reply.id, displayName);
              }}
              className="hover:text-gray-300 transition-colors font-medium"
            >
              Reply
            </button>
            <span className="text-xs text-gray-500 ml-2">{formatTime(reply.time || '')}</span>
          </div>
        </div>
      </div>

      {replyingTo === reply.id && (
        <div className="ml-9">
          <div className="bg-gray-800/30 rounded-2xl p-3 border border-gray-700/50">
            <div className="flex items-start gap-3">
              <div className="relative">
                {user?.image && (user.image.startsWith('http') || user.image.startsWith('data:image')) ? (
                  <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                )}
                <button 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center"
                  title="Change replying identity"
                  aria-label="Change replying identity"
                >
                  <svg className="w-2 h-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <form onSubmit={(e) => onSubmitReply(e, reply.id, user || {})} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full rounded-xl bg-gray-700/50 border border-gray-600/50 pl-4 pr-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                    <button
                      ref={emojiButtonRef}
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors p-1"
                      title="Add emoji"
                      tabIndex={-1}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                      </svg>
                    </button>
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
                    {/* Đặt popup emoji ở đây để luôn hiển thị dưới icon emoji */}
                    {showEmojiPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="absolute z-50 right-10 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-lg"
                      >
                        <div className="grid grid-cols-8 gap-1">
                          {EMOJIS.map((emoji: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-lg"
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
    </div>
  );
} 