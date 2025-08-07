'use client';

import React, { useState } from 'react';
import { cn } from '~/lib/utils';
import WaveStatsText from './WaveStatsText';
import { useToastContext } from '~/components/toast-provider';

type WalletTabType = "daedalus" | "yoroi";

interface WaveFooterSectionProps {
  className?: string;
  lightOverlay?: string;
  darkOverlay?: string;
}

export default function WaveFooterSection({ 
  className,
  lightOverlay = "bg-cyan-400/20",
  darkOverlay = "bg-gray-900/60"
}: WaveFooterSectionProps) {
  const [activeWalletTab, setActiveWalletTab] = useState<WalletTabType>("daedalus");
  const { showSuccess } = useToastContext();

  const handleWalletTabChange = (tab: WalletTabType) => {
    setActiveWalletTab(tab);
  };
  return (
    <div className={cn(
      "relative min-h-screen w-full overflow-hidden",
      className
    )}>
      <div className="absolute inset-0">
        <img
          src="/images/common/wave-footer.png"
          alt="Wave Footer Background"
          className="w-full h-full object-cover opacity-60 dark:opacity-40"
          draggable={false}
        />
      </div>
      <div className={cn(
        "absolute inset-0 transition-all duration-300",
        lightOverlay,
        `dark:${darkOverlay}`
      )} />
      <div className="relative z-10 h-full w-full flex flex-col sm:flex-row items-start">
        <div className="flex flex-col w-full sm:w-auto max-w-xs sm:max-w-none mt-8 sm:mt-16 mr-4 sm:mr-16 z-30 order-2 sm:order-2 items-end self-end sm:self-auto sm:items-end sm:ml-auto">
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto pointer-events-auto">
            <button
              onClick={() => handleWalletTabChange("daedalus")}
              className={cn(
                "px-4 sm:px-6 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 border-2 whitespace-normal",
                activeWalletTab === "daedalus"
                  ? "bg-teal-400/80 border-white shadow-lg"
                  : "bg-teal-100/60 dark:bg-teal-900/40 border-white dark:border-white hover:bg-teal-200/70 dark:hover:bg-teal-800/50 backdrop-blur-sm"
              )}
            >
              <span className={cn("font-semibold", activeWalletTab === "daedalus" ? "text-white" : "text-white/80")}>DAEDALUS</span>
            </button>
            <button
              onClick={() => handleWalletTabChange("yoroi")}
              className={cn(
                "px-4 sm:px-6 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 border-2 whitespace-normal",
                activeWalletTab === "yoroi"
                  ? "bg-teal-400/80 border-white shadow-lg"
                  : "bg-teal-100/60 dark:bg-teal-900/40 border-white dark:border-white hover:bg-teal-200/70 dark:hover:bg-teal-800/50 backdrop-blur-sm"
              )}
            >
              <span className={cn("font-semibold", activeWalletTab === "yoroi" ? "text-white" : "text-white/80")}>YOROI & OTHERS</span>
            </button>
          </div>
          <div className="w-full sm:w-auto mt-2">
            {activeWalletTab === "daedalus" && (
              <div
                className="text-base sm:text-lg mt-1 opacity-75 break-all text-blue-200 font-semibold cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText('d0f005a0a823b331583a5d0083f3745f39fd36ad13bbc0845e147892');
                  showSuccess('Copied pool ID!');
                }}
              >
                d0f005a0a823b331583a5d0083f3745f39fd36ad13bbc0845e14<br />7892
              </div>
            )}
            {activeWalletTab === "yoroi" && (
              <div
                className="text-base sm:text-lg mt-1 opacity-75 break-all text-blue-200 font-semibold cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText('d0f005a0a823b331583a5d0083f3745f39fd36ad13bbc0845e147892');
                  showSuccess('Copied pool ID!');
                }}
              >
                pool-id: d0f005a0a823b331583a5d0083f3745f39fd36ad13b<br />bc0845e147892
              </div>
            )}
          </div>
        </div>

        <div className="max-w-2xl w-full pl-4 sm:pl-8 pt-12 pr-4 sm:pr-0 flex-1 order-1 sm:order-1">
          <WaveStatsText />
        </div>
      </div>
    </div>
  );
}


