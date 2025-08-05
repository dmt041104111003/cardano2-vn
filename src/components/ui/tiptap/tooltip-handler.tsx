"use client";

import { useEffect, useState } from 'react';
import { TruncatedText } from './truncated-text';
import { TooltipData } from '~/constants/tooltip';
import Modal from '~/components/admin/common/Modal';

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