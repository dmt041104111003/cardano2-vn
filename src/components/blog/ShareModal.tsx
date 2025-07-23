"use client";

import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogTitle: string;
  blogUrl: string;
}

export default function ShareModal({ isOpen, onClose, blogTitle, blogUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy link');
    }
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleZaloShare = () => {
    const url = `https://zalo.me/share?u=${encodeURIComponent(blogUrl)}&t=${encodeURIComponent(blogTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blogTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Share this post</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
            aria-label="Close share modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleFacebookShare}
            className="w-full group relative overflow-hidden bg-transparent border border-gray-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/30">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Facebook</div>
                <div className="text-gray-400 text-sm">Share on Facebook</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button 
            onClick={handleZaloShare}
            className="w-full group relative overflow-hidden bg-transparent border border-gray-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/30">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Zalo</div>
                <div className="text-gray-400 text-sm">Share on Zalo</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button 
            onClick={handleTelegramShare}
            className="w-full group relative overflow-hidden bg-transparent border border-gray-600/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-blue-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/30">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Telegram</div>
                <div className="text-gray-400 text-sm">Share on Telegram</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button 
            onClick={handleCopyLink}
            className="w-full group relative overflow-hidden bg-transparent border border-gray-600/50 hover:border-gray-500/50 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center shadow-lg border border-gray-500/30">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">
                  {copied ? "Copied!" : "Copy Link"}
                </div>
                <div className="text-gray-400 text-sm">
                  {copied ? "Link copied to clipboard" : "Copy to clipboard"}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>


        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm text-center">
            Share this amazing content with your friends!
          </p>
        </div>
      </div>
    </div>
  );
} 