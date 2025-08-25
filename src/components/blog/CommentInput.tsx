"use client";

import { useState, useRef, useEffect } from "react";

import { EMOJIS } from "../../constants/emoji";
import { CommentInputProps } from '~/constants/comment';

export default function CommentInput({ onSubmit, user }: CommentInputProps) {
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const isUserBanned = user && user.isBanned && user.bannedUntil && new Date(user.bannedUntil) > new Date();


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText, user);
      setCommentText("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }
      console.log("File uploaded:", file.name);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/50">
      {isUserBanned ? (
        <>
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">You are banned from commenting</span>
            </div>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400">
            <span>Ban duration: <b>{user.bannedUntil ? new Date(user.bannedUntil).toLocaleString() : 'Unknown'}</b></span>
          </div>
        </>
      ) : (
        <div className="flex items-start gap-3">
        <div className="relative">
          {user && user.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
          )}
          <button 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center"
            title="Change commenting identity"
            aria-label="Change commenting identity"
          >
            <svg className="w-2 h-2 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full rounded-xl bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 pl-4 pr-10 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
              />
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors p-1"
                title="Add emoji"
                tabIndex={-1}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors p-1"
                aria-label="Send comment"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
         
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute z-50 right-10 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg"
                >
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJIS.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              title="Upload file"
              aria-label="Upload file"
                         />
           </form>
         </div>
       </div>
       )}
     </div>
   );
} 