"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CourseModalTitleProps {
  title: string;
  maxLength: number;
  className?: string;
}

export default function CourseModalTitle({ title, maxLength, className = "" }: CourseModalTitleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLength, setCurrentLength] = useState(maxLength);

  if (!title) return null;

  const shouldShowMore = title.length > currentLength;
  const displayText = title.slice(0, currentLength);
  const isFullyExpanded = currentLength >= title.length;

  const handleToggle = async () => {
    if (isFullyExpanded) {
      setIsExpanded(false);
      setCurrentLength(maxLength);
    } else {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setCurrentLength(title.length);
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {displayText}
        {shouldShowMore && "..."}
      </motion.h3>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 space-y-1"
        >
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </motion.div>
      )}
      
      {shouldShowMore && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-2"
        >
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
          >
            <span>{isFullyExpanded ? "Show less" : "Read more"}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
