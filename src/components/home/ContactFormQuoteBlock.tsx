import React from 'react';

interface ContactFormQuoteBlockProps {
  title?: string;
  description?: string;
}

export default function ContactFormQuoteBlock({ title, description }: ContactFormQuoteBlockProps) {
  return (
    <div className="bg-blue-50/80 dark:bg-gray-800/80 rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 dark:from-blue-300 to-transparent"></div>
        <h2 className="text-3xl lg:text-4xl font-bold text-blue-800 dark:text-blue-200 w-full">
          {title || 'Register for an C2VN course'}
        </h2>
      </div>
      <p className="text-lg lg:text-xl leading-relaxed text-blue-700 dark:text-blue-100 text-justify w-full">
        {description || `Have questions about Cardano or want to collaborate? We'd love to hear from you. Reach out to our team and let's build the future of blockchain together.`}
      </p>
    </div>
  );
}