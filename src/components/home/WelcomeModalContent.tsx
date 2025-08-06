"use client";

import { motion } from "framer-motion";
import { images } from "~/public/images";
import WelcomeModalText from "./WelcomeModalText";

interface WelcomeModalContentProps {
  welcomeData: any;
  onButtonClick: () => void;
}

export default function WelcomeModalContent({ welcomeData, onButtonClick }: WelcomeModalContentProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-center space-y-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl font-bold text-gray-900 dark:text-white"
      >
        {welcomeData?.title || ""}
      </motion.h2>
      
      {(welcomeData?.startDate || welcomeData?.endDate) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {welcomeData?.startDate && `From: ${formatDate(welcomeData.startDate)}`}
          {welcomeData?.startDate && welcomeData?.endDate && " - "}
          {welcomeData?.endDate && `To: ${formatDate(welcomeData.endDate)}`}
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="w-full aspect-video mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden"
      >
        {welcomeData?.imageUrl ? (
          <img 
            src={welcomeData.imageUrl} 
            alt="Welcome" 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={images.loading.src} 
            alt="Loading" 
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>
      
      <WelcomeModalText
        text={welcomeData?.description || ""}
        maxLength={200}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="pt-4"
      >
        <button
          onClick={onButtonClick}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-400/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 font-medium rounded-lg border border-blue-300 dark:border-blue-600 hover:bg-blue-400/30 dark:hover:bg-blue-400/30 transition-colors duration-200"
        >
          Get Started
        </button>
      </motion.div>
    </motion.div>
  );
}
