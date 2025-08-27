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
  return (
    <section className="relative">
      <h1 className="mb-10 text-5xl font-bold  lg:text-8xl">
        <span className="block tracking-tight text-gray-900 dark:text-white">{content.title}</span>
        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text tracking-tight text-gray-900 dark:text-transparent drop-shadow-lg">
          {content.subtitle}
        </span>
        <span className="mt-4 block text-2xl font-normal text-gray-600 dark:text-gray-300 lg:text-4xl">{content.description}</span>
      </h1>
      <div className="relative mb-12 border-l-2 border-gray-300 dark:border-white/20 pl-6">
        <p className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          {content.mainText}
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400">{content.subText}</p>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          href={routers.about}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-blue-600 dark:bg-white px-8 py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100"
        >
          Our Services
        </Link>
        <Link
          href={routers.docs}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Our Projects
        </Link>
      </div>
    </section>
  );
}
