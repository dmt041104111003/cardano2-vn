"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LandingContentProps } from '~/constants/admin';

export default function LandingContent({ content }: LandingContentProps) {
  // Calculate content length to determine font sizes
  const totalLength = content.title.length + content.subtitle.length + content.description.length + content.mainText.length + content.subText.length;
  
  // Dynamic font sizing based on content length
  const getFontSizes = () => {
    if (totalLength > 500) {
      return {
        title: "text-3xl lg:text-5xl xl:text-6xl",
        subtitle: "text-2xl lg:text-4xl xl:text-5xl", 
        description: "text-base lg:text-lg xl:text-xl",
        mainText: "text-sm lg:text-base xl:text-lg",
        subText: "text-xs lg:text-sm xl:text-base"
      };
    } else if (totalLength > 300) {
      return {
        title: "text-4xl lg:text-6xl xl:text-7xl",
        subtitle: "text-3xl lg:text-5xl xl:text-6xl",
        description: "text-lg lg:text-xl xl:text-2xl", 
        mainText: "text-base lg:text-lg xl:text-xl",
        subText: "text-sm lg:text-base xl:text-lg"
      };
    } else {
      return {
        title: "text-5xl lg:text-7xl xl:text-8xl",
        subtitle: "text-4xl lg:text-6xl xl:text-7xl",
        description: "text-xl lg:text-2xl xl:text-3xl",
        mainText: "text-lg lg:text-xl xl:text-2xl", 
        subText: "text-base lg:text-lg xl:text-xl"
      };
    }
  };

  const fontSizes = getFontSizes();

  return (
    <div className="grid items-center gap-6 lg:gap-8 lg:grid-cols-2 min-h-screen">
      <section className="relative flex flex-col justify-center">
        <h1 className={`mb-6 lg:mb-8 font-bold ${fontSizes.title}`}>
          <motion.span
            className="block text-gray-900 dark:text-white"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {content.title}
          </motion.span>
          <motion.span
            className="block text-blue-600 dark:text-blue-400"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            {content.subtitle}
          </motion.span>
        </h1>
        
        <motion.p
          className={`mb-6 lg:mb-8 text-gray-600 dark:text-gray-300 ${fontSizes.description}`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          {content.description}
        </motion.p>
        
        <motion.div
          className="space-y-3 lg:space-y-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <p className={`text-gray-700 dark:text-gray-200 ${fontSizes.mainText}`}>
            {content.mainText}
          </p>
          <p className={`text-gray-600 dark:text-gray-400 ${fontSizes.subText}`}>
            {content.subText}
          </p>
        </motion.div>
      </section>
    </div>
  );
} 