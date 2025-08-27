"use client";

import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { routers } from "~/constants/routers";

interface LandingContentSectionProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
  };
}

export default function LandingContentSection({ content }: LandingContentSectionProps) {
  const totalLength = content.title.length + content.subtitle.length + content.description.length + content.mainText.length + content.subText.length;
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
    <section className="relative min-h-screen flex flex-col justify-center">
      <h1 className={`mb-4 lg:mb-6 font-bold ${fontSizes.title}`}>
        <span className="block tracking-tight text-gray-900 dark:text-white">{content.title}</span>
        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text tracking-tight text-gray-900 dark:text-transparent drop-shadow-lg">
          {content.subtitle}
        </span>
        <span className={`mt-2 lg:mt-3 block font-normal text-gray-600 dark:text-gray-300 ${fontSizes.description}`}>
          {content.description}
        </span>
      </h1>
      
      <div className="relative mb-4 lg:mb-6 border-l-2 border-gray-300 dark:border-white/20 pl-4 lg:pl-6">
        <p className={`mb-2 lg:mb-3 leading-relaxed text-gray-600 dark:text-gray-300 ${fontSizes.mainText}`}>
          {content.mainText}
        </p>
        <p className={`text-gray-500 dark:text-gray-400 ${fontSizes.subText}`}>
          {content.subText}
        </p>
      </div>
      
      <div className="flex flex-col gap-4 lg:gap-6 sm:flex-row">
        <Link
          href={routers.ourService}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success bg-blue-600 dark:bg-white px-6 lg:px-8 py-3 lg:py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100 text-base lg:text-lg xl:text-xl"
        >
          Our Services
        </Link>
        <Link
          href="/project?typeFilter=project"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-6 lg:px-8 py-3 lg:py-4 font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm lg:text-base xl:text-lg"
        >
          Our Projects
        </Link>
      </div>
    </section>
  );
}
