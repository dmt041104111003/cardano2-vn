"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToastContext } from "~/components/toast-provider";

interface WalletHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TABS = [
  { id: "metamask", label: "MetaMask" },
];

export default function WalletHelpModal({ isOpen, onClose, activeTab, onTabChange }: WalletHelpModalProps) {
  const [mounted, setMounted] = useState(false);
  const [internalTab, setInternalTab] = useState<string>(activeTab || "metamask");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const { showSuccess, showError } = useToastContext();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showSuccess?.("Copied", `${label} copied to clipboard.`);
    } catch (e) {
      showError?.("Copy failed", `Could not copy ${label}.`);
    }
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (typeof activeTab === "string") setInternalTab(activeTab); }, [activeTab]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const changeTab = (id: string) => {
    setInternalTab(id);
    if (onTabChange) onTabChange(id);
  };

  if (!mounted) return null;

  const renderContent = () => {
    if (internalTab === "metamask") {
      return (
        <div className="space-y-4">

          <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">How to set up the network</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-200">
              <li>In MetaMask → Add Network</li>
              <li>
                RPC URL: 
                <button
                  type="button"
                  onClick={() => copyToClipboard("https://rpc-mainnet-cardano-evm.c1.milkomeda.com", "RPC URL")}
                  className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  title="Click to copy"
                >
                  https://rpc-mainnet-cardano-evm.c1.milkomeda.com
                </button>
              </li>
              <li>
                Chain ID: 
                <button
                  type="button"
                  onClick={() => copyToClipboard("2001", "Chain ID")}
                  className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  title="Click to copy"
                >
                  2001
                </button>
              </li>
              <li>
                Currency symbol: 
                <button
                  type="button"
                  onClick={() => copyToClipboard("mADA", "Currency symbol")}
                  className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  title="Click to copy"
                >
                  mADA
                </button>
              </li>
              <li>
                Explorer: 
                <button
                  type="button"
                  onClick={() => copyToClipboard("https://explorer-mainnet-cardano-evm.c1.milkomeda.com", "Explorer URL")}
                  className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  title="Click to copy"
                >
                  https://explorer-mainnet-cardano-evm.c1.milkomeda.com
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Visual guide</div>
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/images/wallets/metamask-hd1.png"
                  alt="Open MetaMask and choose Add Network"
                  className="w-40 h-auto rounded-lg border border-gray-200 dark:border-gray-700 cursor-zoom-in hover:opacity-95 transition"
                  onClick={() => setPreviewSrc('/images/wallets/metamask-hd1.png')}
                />
                <div className="text-xs text-gray-600 dark:text-gray-300">1) Open MetaMask → Add Network</div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-2xl text-gray-400"
                aria-hidden
              >
                <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>→</motion.span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/images/wallets/metamask-hd2.png"
                  alt="Go to network settings"
                  className="w-40 h-auto rounded-lg border border-gray-200 dark:border-gray-700 cursor-zoom-in hover:opacity-95 transition"
                  onClick={() => setPreviewSrc('/images/wallets/metamask-hd2.png')}
                />
                <div className="text-xs text-gray-600 dark:text-gray-300">2) Go to network settings</div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="text-2xl text-gray-400"
                aria-hidden
              >
                <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}>→</motion.span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <img
                  src="/images/wallets/metamask-hd3.png"
                  alt="Enter Milkomeda C1 RPC, Chain ID 2001, symbol mADA, explorer"
                  className="w-40 h-auto rounded-lg border border-gray-200 dark:border-gray-700 cursor-zoom-in hover:opacity-95 transition"
                  onClick={() => setPreviewSrc('/images/wallets/metamask-hd3.png')}
                />
                <div className="text-xs text-gray-600 dark:text-gray-300">3) Enter RPC/Chain ID/Symbol/Explorer</div>
              </div>
            </div>
          </div>
          
        </div>
      );
    }
    return null;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.div
          initial={{ opacity: 0, scaleX: 0, filter: "blur(12px)", transformOrigin: "right" }}
          animate={{ opacity: 1, scaleX: 1, filter: "blur(0px)", transformOrigin: "right" }}
          exit={{ opacity: 0, scaleX: 0, filter: "blur(12px)", transformOrigin: "right" }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transparent-scrollbar rounded-[28px] border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-700">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Wallet setup guide</div>
            </div>

            <div className="border-b border-gray-100 dark:border-gray-700 px-4">
              <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => changeTab(t.id)}
                    className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      internalTab === t.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">{t.label}</span>
                      <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4">{renderContent()}</div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={onClose}
            className="absolute"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '4em',
              height: '4em',
              border: 'none',
              background: 'rgba(180, 83, 107, 0.11)',
              borderRadius: '5px',
              transition: 'background 0.5s',
              zIndex: 50
            }}
            aria-label="Close"
          >
            <span 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '2em',
                height: '1.5px',
                backgroundColor: 'rgb(255, 255, 255)',
                transform: 'translateX(-50%) rotate(45deg)'
              }}
            />
            <span 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '2em',
                height: '1.5px',
                backgroundColor: '#fff',
                transform: 'translateX(-50%) rotate(-45deg)'
              }}
            />
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {previewSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
              onClick={() => setPreviewSrc(null)}
              aria-label="Preview image"
            >
              <motion.img
                key={previewSrc}
                src={previewSrc}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="max-h-[90vh] max-w-[90vw] rounded-lg border border-white/10 shadow-2xl"
                alt="Preview"
              />
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}


