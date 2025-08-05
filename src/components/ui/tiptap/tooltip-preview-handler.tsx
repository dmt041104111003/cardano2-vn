"use client";

import { useEffect, useState } from 'react';
import { TruncatedText } from './truncated-text';
import { TooltipData } from '~/constants/tooltip';
import Modal from '~/components/admin/common/Modal';

export function TooltipPreviewHandler() {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  useEffect(() => {
    const handleTooltipClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const tooltipElement = target.closest('[data-tooltip]');
      
      if (tooltipElement) {
        event.preventDefault();
        event.stopPropagation();
        
        const tooltipText = tooltipElement.getAttribute('data-tooltip');
        if (tooltipText) {
          const clickedText = (event.target as HTMLElement).textContent || '';
          
          setTooltipData({
            text: tooltipText,
            clickedText,
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY
          });
        }
      }
    };

    const previewContainer = document.querySelector('.prose');
    if (previewContainer) {
      previewContainer.addEventListener('click', handleTooltipClick);
      
      return () => {
        previewContainer.removeEventListener('click', handleTooltipClick);
      };
    }
  }, []);

  const handleClose = () => {
    setTooltipData(null);
  };

  if (!tooltipData) return null;

  return (
    <Modal
      isOpen={!!tooltipData}
      onClose={handleClose}
      title={tooltipData.clickedText}
    >
      <div className="p-4">
        <TruncatedText 
          text={tooltipData.text}
          maxLength={200}
          className="text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed"
        />
      </div>
    </Modal>
  );
} 