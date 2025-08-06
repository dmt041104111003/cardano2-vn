"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface WelcomeModalTextProps {
  text: string;
  maxLength: number;
  className?: string;
}

export default function WelcomeModalText({ text, maxLength, className = "" }: WelcomeModalTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLength, setCurrentLength] = useState(maxLength);

  if (!text) return null;

  const getLoadingSteps = (textLength: number) => {
    if (textLength <= 200) return 1;
    if (textLength <= 400) return 2;
    if (textLength <= 600) return 3;
    return 3;
  };

  const totalSteps = getLoadingSteps(text.length);
  const stepSize = Math.ceil(text.length / totalSteps);
  
  const shouldShowMore = text.length > currentLength;
  const displayText = text.slice(0, currentLength);
  const isFullyExpanded = currentLength >= text.length;

  const handleToggle = async () => {
    if (isFullyExpanded) {
      setIsExpanded(false);
      setCurrentLength(maxLength);
    } else {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentLength(Math.min(currentLength + stepSize, text.length));
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-gray-600 dark:text-gray-300 leading-relaxed text-base text-justify"
      >
        {displayText}
        {shouldShowMore && "..."}
      </motion.p>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 space-y-2"
        >
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </motion.div>
      )}
      
      {shouldShowMore && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-2 text-center"
        >
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
          >
            <span>{isFullyExpanded ? "Show less" : "Read more"}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
