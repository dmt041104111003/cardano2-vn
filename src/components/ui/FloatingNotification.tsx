"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import WelcomeModal from "~/components/home/WelcomeModal";

interface FloatingNotificationProps {
  children?: React.ReactNode;
}

export default function FloatingNotification({ children }: FloatingNotificationProps) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
        onClick={handleOpenModal}
      >
        <div className="relative w-14 h-14">
          {/* Ripple effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>

          {/* Main button */}
          <div className="absolute inset-0 w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">C2VN</span>
            </div>
          </div>
        </div>
      </motion.div>
      <WelcomeModal isOpen={showModal} onClose={handleCloseModal} />
    </>
  );
}
