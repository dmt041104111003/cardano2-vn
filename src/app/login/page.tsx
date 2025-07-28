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
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

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