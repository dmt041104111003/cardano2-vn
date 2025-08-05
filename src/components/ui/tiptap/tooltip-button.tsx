"use client";

import { useState, useEffect } from 'react';
import { TooltipPopup } from './tooltip-popup';
import { TooltipBadges } from './tooltip-badges';
import { useTooltipSelection, useTooltipEvents, useTooltipActions, useLockedTexts } from './tooltip-hooks';
import { TooltipButtonProps } from '~/constants/tooltip';

export function TooltipButton({ editor }: TooltipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipCount, setTooltipCount] = useState(0);

  const selectedText = useTooltipSelection(editor);
  useTooltipEvents(editor, setTooltipText, setIsOpen);
  const { addTooltip, removeTooltip, unlockText, lockText } = useTooltipActions(editor);
  const { lockedTexts, addLockedText, removeLockedText } = useLockedTexts(editor);

  const handleAddTooltip = () => {
    if (!editor || !tooltipText.trim()) return;

    const { from, to } = editor.state.selection;
    
    if (from === to) {
      return;
    }

    addTooltip(tooltipText, from, to);
    setTooltipText('');
    setIsOpen(false);
    
    const currentText = editor.state.doc.textBetween(from, to);
    removeLockedText(currentText);
    unlockText(from, to);
    
    setTooltipCount(prev => prev + 1);
  };

  const handleRemoveTooltip = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const currentText = editor.state.doc.textBetween(from, to);
    
    removeTooltip(from, to);
    setIsOpen(false);
    
    removeLockedText(currentText);
    unlockText(from, to);
  };

  const handleButtonClick = () => {
    const { from, to } = editor.state.selection;
    
    if (from === to) {
      return;
    }
    
    const currentText = editor.state.doc.textBetween(from, to);
    const isCurrentlyLocked = lockedTexts.has(currentText);
    
    let hasTooltip = false;
    for (let pos = from; pos < to; pos++) {
      const marks = editor.state.doc.resolve(pos).marks();
      if (marks.some(mark => mark.type.name === 'tooltip')) {
        hasTooltip = true;
        break;
      }
    }
    
    if (hasTooltip) {
      return;
    }
    
    if (isCurrentlyLocked) {
      removeLockedText(currentText);
      unlockText(from, to);
    } else {
      addLockedText(currentText, from, to);
      lockText(from, to);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (lockedTexts.size > 0) {
      const handleSelectionUpdate = () => {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          const currentText = editor.state.doc.textBetween(from, to);
          if (lockedTexts.has(currentText)) {
            editor.commands.setTextSelection({ from, to });
          }
        }
      };

      editor.on('selectionUpdate', handleSelectionUpdate);
      
      return () => {
        editor.off('selectionUpdate', handleSelectionUpdate);
      };
    }
  }, [lockedTexts, editor]);

  if (!editor) return null;

  const { from, to } = editor.state.selection;
  const hasSelectedText = from !== to;
  
  let hasTooltip = false;
  if (hasSelectedText) {
    for (let pos = from; pos < to; pos++) {
      const marks = editor.state.doc.resolve(pos).marks();
      if (marks.some(mark => mark.type.name === 'tooltip')) {
        hasTooltip = true;
        break;
      }
    }
  }
  
  const isDisabled = !hasSelectedText || hasTooltip;

  return (
    <div className="relative" data-tooltip-button>
      <button
        onClick={handleButtonClick}
        disabled={isDisabled}
        className={`p-2 rounded transition-colors border ${
          isDisabled 
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50' 
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        title={isDisabled ? "Text already has tooltip or no text selected" : "Add Tooltip to Selected Text"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
                 <TooltipBadges 
           lockedTextsSize={lockedTexts.size}
           tooltipCount={tooltipCount}
           selectedText={selectedText}
         />

                   <TooltipPopup
            isOpen={isOpen}
            selectedText={selectedText}
            tooltipText={tooltipText}
            onTooltipTextChange={setTooltipText}
            onAddTooltip={handleAddTooltip}
            onRemoveTooltip={handleRemoveTooltip}
            onClose={() => {
              setIsOpen(false);
              setTooltipText('');
            }}
          />
    </div>
  );
} 