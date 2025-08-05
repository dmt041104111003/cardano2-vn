"use client";

import { TruncatedText } from './truncated-text';
import { TooltipPopupProps } from '~/constants/tooltip';
import Modal from '~/components/admin/common/Modal';

export function TooltipPopup({
  isOpen,
  selectedText,
  tooltipText,
  onTooltipTextChange,
  onAddTooltip,
  onRemoveTooltip,
  onClose
}: TooltipPopupProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Tooltip"
    >
      <div className="space-y-4">
        {selectedText && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Selected Text:</p>
            <TruncatedText 
              text={selectedText} 
              maxLength={100}
              className="text-sm text-blue-800 dark:text-blue-200 break-words"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tooltip Content
          </label>
          <textarea
            value={tooltipText}
            onChange={(e) => onTooltipTextChange(e.target.value)}
            placeholder="Enter tooltip content for the selected text..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAddTooltip}
            disabled={!tooltipText.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Add Tooltip
          </button>
          <button
            onClick={onRemoveTooltip}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium transition-colors"
          >
            Remove Tooltip
          </button>
        </div>
      </div>
    </Modal>
  );
} 