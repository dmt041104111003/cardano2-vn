"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cardanoWallet, CardanoWalletUser } from "~/lib/cardano-wallet";

export function useCardanoWallet() {
  const { data: session, status, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<CardanoWalletUser | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!(session?.user && (session.user as { address?: string }).address);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setHasLoggedIn(false);
    try {
      if (!cardanoWallet.isWalletInstalled()) {
        throw new Error("Cardano Wallet is not installed. Please install it first.");
      }
      const user = await cardanoWallet.connect();
      const networkId = await cardanoWallet.getWallet()?.getNetworkId();
      if (networkId !== 1) {
        throw new Error("Vui lòng chuyển ví sang mạng Mainnet để đăng nhập.");
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
      console.error("Error connecting to Cardano Wallet:", err);
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
      console.error("Error disconnecting from Cardano Wallet:", err);
    }
  }, []);

  const getBalance = useCallback(async () => {
    if (!cardanoWallet.getConnectionStatus()) {
      throw new Error("Wallet not connected");
    }
    try {
      return await cardanoWallet.getBalance();
    } catch (err) {
      console.error("Error getting balance:", err);
      throw err;
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
    getBalance,
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