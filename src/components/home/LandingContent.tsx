"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LandingContentProps } from '~/constants/admin';

export default function LandingContent({ content }: LandingContentProps) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <section className="relative">
        <h1 className="mb-10 text-5xl font-bold lg:text-8xl">
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
          className="mb-8 text-xl text-gray-600 dark:text-gray-300"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          {content.description}
        </motion.p>
        
        <motion.div
          className="space-y-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <p className="text-lg text-gray-700 dark:text-gray-200">
            {content.mainText}
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {content.subText}
          </p>
        </motion.div>
      </section>
    </div>
  );
} 