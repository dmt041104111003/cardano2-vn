import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useCardanoWallet } from "~/hooks/useCardanoWallet";
import { useToastContext } from "~/components/toast-provider";

interface Wallet {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface WalletListProps {
  wallets: Wallet[];
}

export default function WalletList({ wallets }: WalletListProps) {
  const { connect, disconnect, isConnecting, error, walletUser, isAuthenticated, isWalletInstalled, hasLoggedIn } = useCardanoWallet();
  const { showError, showSuccess, showInfo } = useToastContext();
  const lastErrorRef = useRef<string>("");
  const lastSuccessRef = useRef<string>("");

  const handleWalletClick = async (walletId: string) => {
    if (walletId === "eternal") {
      if (isAuthenticated) {
        await disconnect();
        showSuccess("Logout Successful", "Your Cardano wallet has been disconnected successfully.");
      } else {
        showInfo("Connecting...", "Please wait while we connect to your Cardano wallet.");
        await connect();
      }
    } else if (walletId === "google") {
      showInfo("Connecting...", "Please wait while we connect to your Google account.");
      await signIn("google", { callbackUrl: "/" });
    } else {
      console.log(`Connecting to ${walletId}...`);
    }
  };

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      showError("Connection Error", error);
    }
  }, [error, showError]);

  useEffect(() => {
    if (hasLoggedIn && walletUser) {
      const successKey = `connected-${walletUser.address}`;
      if (successKey !== lastSuccessRef.current) {
        lastSuccessRef.current = successKey;
        const shortAddress = `${walletUser.address.slice(0, 6)}...${walletUser.address.slice(-4)}`;
        showSuccess(
          "Login Successful!",
          `Welcome to Cardano2VN! Your wallet ${shortAddress} has been connected successfully.`
        );
      }
    }
  }, [hasLoggedIn, walletUser, showSuccess]);

  return (
    <div className="flex-1">
      <div className="space-y-3 h-[356px] overflow-y-auto pr-2">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => handleWalletClick(wallet.id)}
            disabled={wallet.id === "eternal" && isConnecting}
            className={`w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex items-center gap-3 bg-white ${
              wallet.id === "eternal" && isConnecting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="text-sm text-gray-700 font-medium flex-1">
              {wallet.name}
            </span>
            {wallet.id === "eternal" ? (
              isConnecting ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Image
                  src="/images/wallets/eternal.png"
                  alt="Eternal Wallet"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  loading="lazy"
                />
              )
            ) : wallet.id === "sol" ? (
              <Image
                src="/images/wallets/solana.png"
                alt="Sol Wallet"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            ) : wallet.id === "facebook" ? (
              <Image
                src="/images/wallets/facebook.png"
                alt="Facebook"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            ) : wallet.id === "google" ? (
              <Image
                src="/images/wallets/google.png"
                alt="Google"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            ) : wallet.id === "github" ? (
              <Image
                src="/images/wallets/github.png"
                alt="GitHub"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            ) : wallet.id === "phantom" ? (
              <Image
                src="/images/wallets/phantom.png"
                alt="Phantom"
                width={32}
                height={32}
                className="w-8 h-8 rounded-none"
                loading="lazy"
              />
            ) : wallet.id === "metamask" ? (
              <Image
                src="/images/wallets/metamask.png"
                alt="MetaMask"
                width={32}
                height={32}
                className="w-8 h-8"
                loading="lazy"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full ${wallet.color} flex items-center justify-center text-white text-sm font-bold`}>
                {wallet.logo}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 