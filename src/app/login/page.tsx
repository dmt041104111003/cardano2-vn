"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoginHeader from "~/components/login/LoginHeader";
import LoginCardHeader from "~/components/login/LoginCardHeader";
import NetworkSelector from "~/components/login/NetworkSelector";
import WalletList from "~/components/login/WalletList";
import LoginFooter from "~/components/login/LoginFooter";
import { NETWORKS, getWalletsByNetwork } from "~/constants/login";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState("c2vn");

  const wallets = getWalletsByNetwork(selectedNetwork);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  if (session) {
    return null; // Redirect immediately
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
          style={{ objectPosition: "left center" }}
        />
      </motion.div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <LoginHeader />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white rounded-2xl shadow-xl p-3 md:p-4 max-w-md w-full mx-4 md:mx-0"
        >
          <LoginCardHeader />

          <div className="flex flex-row gap-2">
            <NetworkSelector 
              networks={NETWORKS}
              selectedNetwork={selectedNetwork}
              onNetworkSelect={setSelectedNetwork}
            />
            <WalletList wallets={wallets} />
          </div>
        </motion.div>

        <LoginFooter />
      </div>
    </div>
  );
} 