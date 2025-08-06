"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LandingMediaProps } from '~/constants/admin';

export default function LandingMedia({ mediaItems }: LandingMediaProps) {
  if (mediaItems.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <motion.div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
      >
        {mediaItems.map((mediaUrl, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 },
            }}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <img
              src={mediaUrl}
              alt={`Media ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
} 