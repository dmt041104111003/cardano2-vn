"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cardanoWallet, WALLET_NAMES } from "~/lib/cardano-wallet";
import { CardanoWalletUser } from "~/constants/wallet";
import { NetworkValidator } from "~/lib/network-validator";

export function useCardanoWallet() {
  const { data: session, status, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<CardanoWalletUser | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!(session?.user && (session.user as { address?: string }).address);

  const connect = useCallback(async (walletName: string = 'eternal') => {
    setIsConnecting(true);
    setError(null);
    setHasLoggedIn(false);
    try {
      const actualWalletName = WALLET_NAMES[walletName as keyof typeof WALLET_NAMES] || walletName;
      
             if (!(await cardanoWallet.isWalletInstalled(walletName))) {
         throw new Error(`${walletName.charAt(0).toUpperCase() + walletName.slice(1)} Wallet is not installed. Please install it first.`);
       }
      
      const user = await cardanoWallet.connect(actualWalletName);
      
      const wallet = cardanoWallet.getWallet();
      if (wallet) {
        try {
          const networkId = await wallet.getNetworkId();
          const validation = NetworkValidator.validateCardanoNetwork(networkId, actualWalletName);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }
        } catch (networkError) {
        }
      }
      
      setWalletUser(user);
      const message = `Sign this message to authenticate with Cardano2VN\n\nTimestamp: ${Date.now()}`;
      const signature = await cardanoWallet.signMessage(message);
      const result = await signIn("cardano-wallet", {
        address: user.address,
        signature,
        message,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      setHasLoggedIn(true);
      if (typeof update === "function") {
        await update();
      }
      window.location.href = "/";
         } catch (err) {
       const errorMessage = err instanceof Error ? err.message : "Failed to connect to Cardano Wallet";
       setError(errorMessage);
       setHasLoggedIn(false);
     } finally {
      setIsConnecting(false);
    }
  }, [router, update]);

     const disconnect = useCallback(async () => {
     try {
       await cardanoWallet.disconnect();
       setWalletUser(null);
       await signOut({ redirect: false });
     } catch (err) {
     }
   }, []);

     

  useEffect(() => {
    if (cardanoWallet.getConnectionStatus()) {
      setWalletUser(cardanoWallet.getCurrentUser());
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnecting,
    error,
    walletUser,
    isConnected: isAuthenticated,
    isWalletInstalled: cardanoWallet.isWalletInstalled(),
    session,
    status,
    hasLoggedIn,
    isAuthenticated,
  };
} 