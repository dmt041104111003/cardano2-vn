import React, { useState } from 'react';

interface ContactFormQuoteBlockProps {
  title?: string;
  description?: string;
  hasSelectedCourse?: boolean;
}

export default function ContactFormQuoteBlock({ title, description, hasSelectedCourse = false }: ContactFormQuoteBlockProps) {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const defaultTitle = 'Register for an C2VN course';
  const defaultDescription = `Have questions about Cardano or want to collaborate? We'd love to hear from you. Reach out to our team and let's build the future of blockchain together.`;
  
  if (hasSelectedCourse && !title && !description) {
    return null;
  }
  
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;
  
  const shouldTruncateTitle = displayTitle.length > 50;
  const shouldTruncateDescription = displayDescription.length > 200;
  
  const truncatedTitle = shouldTruncateTitle && !isTitleExpanded 
    ? displayTitle.substring(0, 50) + '...' 
    : displayTitle;
    
  const truncatedDescription = shouldTruncateDescription && !isDescriptionExpanded 
    ? displayDescription.substring(0, 200) + '...' 
    : displayDescription;

  return (
    <div className="bg-blue-50/80 dark:bg-gray-800/80 rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-4 w-full">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 dark:from-blue-300 to-transparent flex-shrink-0"></div>
        <div className="flex-1">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-800 dark:text-blue-200">
            {truncatedTitle}
          </h2>
          {shouldTruncateTitle && (
            <button
              onClick={() => setIsTitleExpanded(!isTitleExpanded)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline"
            >
              {isTitleExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
      <div className="w-full">
        <p className="text-lg lg:text-xl leading-relaxed text-blue-700 dark:text-blue-100 text-justify">
          {truncatedDescription}
        </p>
        {shouldTruncateDescription && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="mt-2 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline"
          >
            {isDescriptionExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}