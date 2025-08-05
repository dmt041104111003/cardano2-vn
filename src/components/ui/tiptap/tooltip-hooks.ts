"use client";

import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useToastContext } from '~/components/toast-provider';

export function useTooltipSelection(editor: Editor) {
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (!editor) return;

    const updateSelectedText = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to);
        setSelectedText(text);
      } else {
        setSelectedText('');
      }
    };

    editor.on('selectionUpdate', updateSelectedText);
    editor.on('transaction', updateSelectedText);

    return () => {
      editor.off('selectionUpdate', updateSelectedText);
      editor.off('transaction', updateSelectedText);
    };
  }, [editor]);

  return selectedText;
}

export function useTooltipEvents(editor: Editor, setTooltipText: (text: string) => void, setIsOpen: (open: boolean) => void) {
  const { showSuccess } = useToastContext();

  useEffect(() => {
    if (!editor) return;

    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tooltipElement = target.closest('[data-tooltip]');
      
      if (tooltipElement) {
        event.preventDefault();
        event.stopPropagation();
        
        const tooltipText = tooltipElement.getAttribute('data-tooltip');
        if (tooltipText) {
          setTooltipText(tooltipText);
          setIsOpen(true);
          showSuccess('Tooltip edit form opened');
        }
      }
    };

    const handleSingleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tooltipElement = target.closest('[data-tooltip]');
      
      if (tooltipElement) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener('dblclick', handleDoubleClick);
    editorDom.addEventListener('click', handleSingleClick);

    return () => {
      editorDom.removeEventListener('dblclick', handleDoubleClick);
      editorDom.removeEventListener('click', handleSingleClick);
    };
  }, [editor, setTooltipText, setIsOpen, showSuccess]);
}

export function useTooltipActions(editor: Editor) {
  const { showSuccess } = useToastContext();

  const addTooltip = (tooltipText: string, from: number, to: number) => {
    if (!editor || !tooltipText.trim()) return;

    editor.chain()
      .focus()
      .setTooltip({ tooltip: tooltipText.trim() })
      .run();

    showSuccess('Tooltip added successfully');
  };

  const removeTooltip = (from: number, to: number) => {
    if (!editor) return;
    
    editor.chain()
      .focus()
      .unsetTooltip()
      .run();
    
    showSuccess('Tooltip removed successfully');
  };

  const unlockText = (from: number, to: number) => {
    if (!editor) return;
    
    editor.chain().focus().setTextSelection({ from, to }).unsetMark('lockMark').run();
    showSuccess('Text unlocked');
  };

  const lockText = (from: number, to: number) => {
    if (!editor) return;
    
    editor.chain().focus().setMark('lockMark').run();
  };

  return { addTooltip, removeTooltip, unlockText, lockText };
}

export function useLockedTexts(editor: Editor) {
  const [lockedTexts, setLockedTexts] = useState<Set<string>>(new Set());

  const addLockedText = (text: string, from: number, to: number) => {
    setLockedTexts(prev => {
      const newSet = new Set(prev);
      
      let hasOverlap = false;
      
      for (const lockedText of prev) {
        const docText = editor.state.doc.textContent;
        const lockedTextIndex = docText.indexOf(lockedText);
        
        if (lockedTextIndex !== -1) {
          const lockedTextFrom = lockedTextIndex;
          const lockedTextTo = lockedTextIndex + lockedText.length;
          
          if ((from >= lockedTextFrom && from < lockedTextTo) || 
              (to > lockedTextFrom && to <= lockedTextTo) ||
              (from <= lockedTextFrom && to >= lockedTextTo)) {
            hasOverlap = true;
            break;
          }
        }
      }
      
      if (hasOverlap) {
        const nonOverlappingTexts = new Set<string>();
        
        for (const lockedText of prev) {
          const docText = editor.state.doc.textContent;
          const lockedTextIndex = docText.indexOf(lockedText);
          
          if (lockedTextIndex !== -1) {
            const lockedTextFrom = lockedTextIndex;
            const lockedTextTo = lockedTextIndex + lockedText.length;
            
            if (!((from >= lockedTextFrom && from < lockedTextTo) || 
                  (to > lockedTextFrom && to <= lockedTextTo) ||
                  (from <= lockedTextFrom && to >= lockedTextTo))) {
              nonOverlappingTexts.add(lockedText);
            }
          }
        }
        
        nonOverlappingTexts.add(text);
        return nonOverlappingTexts;
      } else {
        newSet.add(text);
        return newSet;
      }
    });
  };

  const removeLockedText = (text: string) => {
    setLockedTexts(prev => {
      const newSet = new Set(prev);
      newSet.delete(text);
      return newSet;
    });
  };

  return { lockedTexts, addLockedText, removeLockedText };
}

