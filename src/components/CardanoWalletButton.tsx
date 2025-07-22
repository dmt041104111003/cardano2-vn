"use client";

import { useCardanoWallet } from "~/hooks/useCardanoWallet";
import { Wallet, Loader2 } from "lucide-react";
import { useToastContext } from "~/components/toast-provider";
import React, { useRef } from "react";

interface CardanoWalletButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export default function CardanoWalletButton({ 
  className = "", 
  variant = "default"
}: CardanoWalletButtonProps) {
  const { 
    connect, 
    disconnect, 
    isConnecting, 
    error, 
    walletUser, 
    isAuthenticated, 
    isWalletInstalled,
    hasLoggedIn,
  } = useCardanoWallet();

  const { showError, showSuccess, showInfo } = useToastContext();
  const lastErrorRef = useRef<string>("");
  const lastSuccessRef = useRef<string>("");
  const lastDisconnectRef = useRef<boolean>(false);
  const lastConnectingRef = useRef<boolean>(false);

  const handleClick = async () => {
    if (isAuthenticated) {
      await disconnect();
      if (!lastDisconnectRef.current) {
        lastDisconnectRef.current = true;
        showSuccess("Logout Successful", "Your Cardano wallet has been disconnected successfully. You have been logged out.");
      }
    } else {
      lastDisconnectRef.current = false;
      if (!lastConnectingRef.current) {
        lastConnectingRef.current = true;
        showInfo("Connecting...", "Please wait while we connect to your Cardano wallet and authenticate your session.");
      }
      await connect();
    }
  };

  React.useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      lastConnectingRef.current = false;
      showError("Connection Error", error);
    }
  }, [error, showError]);

  React.useEffect(() => {
    if (hasLoggedIn && walletUser) {
      const successKey = `connected-${walletUser.address}`;
      if (successKey !== lastSuccessRef.current) {
        lastSuccessRef.current = successKey;
        lastConnectingRef.current = false;
        const shortAddress = `${walletUser.address.slice(0, 6)}...${walletUser.address.slice(-4)}`;
        showSuccess(
          "Login Successful! 🎉", 
          `Welcome to Cardano2VN! Your wallet ${shortAddress} has been connected successfully. You can now access your profile and manage your account.`
        );
      }
    }
  }, [hasLoggedIn, walletUser, showSuccess]);

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isAuthenticated) return "Disconnect Wallet";
    if (!isWalletInstalled) return "Install Cardano Wallet";
    return "Connect Cardano Wallet";
  };

  const getButtonIcon = () => {
    if (isConnecting) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <Wallet className="w-4 h-4" />;
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium shadow-lg transition-all duration-200";
    
    if (variant === "outline") {
      return `${baseClasses} border-white/30 bg-gray-800/50 text-white hover:border-white/50 hover:bg-gray-700/50`;
    }
    
    if (variant === "ghost") {
      return `${baseClasses} border-transparent text-gray-300 hover:text-white`;
    }
    
    return `${baseClasses} border-white/30 bg-gray-800/50 text-white hover:border-white/50 hover:bg-gray-700/50`;
  };


  if (!isWalletInstalled) {
    return (
      <button
        type="button"
        onClick={() => window.open('https://eternl.io', '_blank', 'noopener,noreferrer')}
        className={`${getButtonClasses()} ${className}`}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`${getButtonClasses()} ${className} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </button>
  );
}