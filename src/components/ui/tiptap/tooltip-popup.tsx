"use client";

import { useRef, useEffect } from 'react';
import { TruncatedText } from './truncated-text';
import { TooltipPopupProps } from '~/constants/tooltip';

export function TooltipPopup({
  isOpen,
  selectedText,
  tooltipText,
  onTooltipTextChange,
  onAddTooltip,
  onRemoveTooltip,
  onClose
}: TooltipPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !popupRef.current) return;
    
    const popup = popupRef.current;
    if (!popup) return;
    
    popup.style.position = 'fixed';
    popup.style.zIndex = '9999';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.maxHeight = '90vh';
    popup.style.overflowY = 'auto';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div ref={popupRef} className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 w-[90vw] max-w-[500px]">
        <div className="space-y-3">
          {selectedText && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Selected Text:</p>
              <TruncatedText 
                text={selectedText} 
                maxLength={80}
                className="text-sm text-blue-800 dark:text-blue-200 break-words"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tooltip Content
            </label>
            <textarea
              value={tooltipText}
              onChange={(e) => onTooltipTextChange(e.target.value)}
              placeholder="Enter tooltip content for the selected text..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onAddTooltip}
              disabled={!tooltipText.trim()}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Add Tooltip
            </button>
            <button
              onClick={onRemoveTooltip}
              className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium transition-colors"
            >
              Remove Tooltip
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 