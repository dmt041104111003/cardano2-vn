"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TruncatedText } from './truncated-text';
import { TooltipData } from '~/constants/tooltip';

export function TooltipHandler() {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  useEffect(() => {
    const handleTooltipClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tooltipElement = target.closest('[data-tooltip]');
      
      if (tooltipElement) {
        event.preventDefault();
        event.stopPropagation();
        
        const isDoubleClick = event.detail === 2;
        
        if (isDoubleClick) {
          return;
        }
        
        const tooltipText = tooltipElement.getAttribute('data-tooltip');
        if (tooltipText) {
          const clickedText = (event.target as HTMLElement).textContent || '';
          
          const tooltipButtons = document.querySelectorAll('[data-tooltip-button]');
          tooltipButtons.forEach(button => {
            const badges = button.querySelectorAll('[data-tooltip-badge]');
            badges.forEach(badge => {
              (badge as HTMLElement).style.filter = 'blur(1px)';
              (badge as HTMLElement).style.opacity = '0.3';
            });
          });
          
          setTooltipData({
            text: tooltipText,
            clickedText,
            x: event.clientX,
            y: event.clientY
          });
        }
      }
    };

    document.addEventListener('click', handleTooltipClick);

    return () => {
      document.removeEventListener('click', handleTooltipClick);
    };
  }, []);

  const handleClose = () => {
    setTooltipData(null);
    
    const tooltipButtons = document.querySelectorAll('[data-tooltip-button]');
    tooltipButtons.forEach(button => {
      const badges = button.querySelectorAll('[data-tooltip-badge]');
      badges.forEach(badge => {
        (badge as HTMLElement).style.filter = 'none';
        (badge as HTMLElement).style.opacity = '1';
      });
    });
  };

  if (!tooltipData) return null;

  const tooltipContent = (
    <>
      <div 
        className="tooltip-overlay fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
        onClick={handleClose}
      />
      <div 
        className="tooltip-popup fixed z-[9999] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 rounded-lg shadow-lg p-4 max-w-sm"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <TruncatedText 
                text={tooltipData.clickedText}
                maxLength={50}
                className="font-semibold text-purple-900 dark:text-purple-100 text-base"
              />
            </div>
            <TruncatedText 
              text={tooltipData.text}
              maxLength={150}
              className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed"
            />
          </div>
          <button 
            className="tooltip-close ml-2 text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-100 transition-colors"
            onClick={handleClose}
            aria-label="Close tooltip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(tooltipContent, document.body);
} 