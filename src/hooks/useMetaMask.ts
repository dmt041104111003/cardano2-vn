"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { metaMaskProvider, MetaMaskUser } from "~/lib/metamask-provider";

export function useMetaMask() {
  const { data: session, status, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<MetaMaskUser | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!(session?.user && (session.user as { address?: string }).address);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setHasLoggedIn(false);
    
    try {
      const user = await metaMaskProvider.connect();
      setWalletUser(user);

      // Sign message for authentication
      const message = `Sign this message to authenticate with Cardano2VN\n\nTimestamp: ${Date.now()}`;
      const signature = await metaMaskProvider.signMessage(message);
      
      const result = await signIn("metamask-wallet", {
        address: user.address,
        signature,
        message,
        chainId: user.chainId?.toString(),
        network: user.network,
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
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to MetaMask";
      setError(errorMessage);
      setHasLoggedIn(false);
    } finally {
      setIsConnecting(false);
    }
  }, [update]);

  const disconnect = useCallback(async () => {
    try {
      await metaMaskProvider.disconnect();
      setWalletUser(null);
      await signOut({ redirect: false });
    } catch (err) {
      console.error('Error disconnecting MetaMask:', err);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (walletUser && accounts[0] !== walletUser.address) {
          // User switched accounts
          setWalletUser(prev => prev ? { ...prev, address: accounts[0] } : null);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletUser, disconnect]);

  // Initialize wallet state
  useEffect(() => {
    if (metaMaskProvider.getConnectionStatus()) {
      const user = metaMaskProvider.getCurrentUser();
      if (user) {
        setWalletUser(user);
      }
    }
  }, []);

  return {
    connect,
    disconnect,
    isConnecting,
    error,
    walletUser,
    isConnected: isAuthenticated,
    session,
    status,
    hasLoggedIn,
    isAuthenticated,
  };
}
