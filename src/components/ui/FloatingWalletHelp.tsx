"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WalletHelpModal from "~/components/ui/WalletHelpModal";

interface FloatingWalletHelpProps {
  className?: string;
}

export default function FloatingWalletHelp({ className = "" }: FloatingWalletHelpProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("c2vn_wallet_help_dismissed") : null;
    if (stored === "true") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setShowModal(true)}
        className={`fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        aria-label="Open wallet help"
      >
        <span>Wallet help</span>
      </motion.button>

      <WalletHelpModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
