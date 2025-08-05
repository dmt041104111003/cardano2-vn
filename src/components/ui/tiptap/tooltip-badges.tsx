"use client";

import { TooltipBadgesProps } from '~/constants/tooltip';

export function TooltipBadges({ lockedTextsSize, tooltipCount, selectedText }: TooltipBadgesProps) {
  return (
    <>
      {(lockedTextsSize > 0 || selectedText) && (
        <div 
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
          title={`${lockedTextsSize} text(s) locked`}
          data-tooltip-badge
        >
          {lockedTextsSize || (selectedText ? 1 : 0)}
        </div>
      )}
      
      {tooltipCount > 0 && (
        <div 
          className="absolute -bottom-1 -left-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
          title={`${tooltipCount} tooltip(s) added`}
          data-tooltip-badge
        >
          {tooltipCount}
        </div>
      )}
    </>
  );
} 