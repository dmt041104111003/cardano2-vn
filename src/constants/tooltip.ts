import { Editor } from '@tiptap/react';

export interface TooltipData {
  text: string;
  clickedText: string;
  x: number;
  y: number;
}

export interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export interface TooltipButtonProps {
  editor: Editor;
}

export interface TooltipBadgesProps {
  lockedTextsSize: number;
  tooltipCount: number;
  selectedText: string;
}

export interface TooltipOptions {
  HTMLAttributes: Record<string, any>;
}

export interface TooltipPopupProps {
  isOpen: boolean;
  selectedText: string;
  tooltipText: string;
  onTooltipTextChange: (text: string) => void;
  onAddTooltip: () => void;
  onRemoveTooltip: () => void;
  onClose: () => void;
} 