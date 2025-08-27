'use client';

import React from 'react';
import { motion } from "framer-motion";
import Title from "~/components/title";
import ServiceContent from '~/components/our-service/ServiceContent';
import { useNotifications } from "~/hooks/useNotifications";
import WaveFooterSection from "~/components/home/WaveFooterSection";

function StatsPageContent() {
  useNotifications();
  
  return (
    <main className="relative pt-20 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Background Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.15, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed left-[-200px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none block"
      >
        <img
          src="/images/common/loading.png"
          alt="Cardano2VN Logo"
          className="w-[1200px] h-[1200px] object-contain"
          draggable={false}
          style={{ objectPosition: 'left center' }}
        />
      </motion.div>
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            title="Our Service"
            description="Discover our SPO (Stake Pool Operator) and DREP (Delegated Representative) services. Learn how to support our Cardano community initiatives."
          />
        </motion.div>
   
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <ServiceContent />
          </div>
  
      </div>
      <WaveFooterSection />
    </main>
  );
}

export default function StatsPageClient() {
  return <StatsPageContent />;
}
