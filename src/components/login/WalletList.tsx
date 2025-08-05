import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useCardanoWallet } from "~/hooks/useCardanoWallet";
import { useToastContext } from "~/components/toast-provider";
import { WalletListProps } from '~/constants/login';

export default function WalletList({ wallets }: WalletListProps) {
  const { connect, disconnect, isConnecting, error, walletUser, isAuthenticated, isWalletInstalled, hasLoggedIn } = useCardanoWallet();
  const { showError, showSuccess, showInfo } = useToastContext();
  const lastErrorRef = useRef<string>("");
  const lastSuccessRef = useRef<string>("");
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);

  const handleWalletClick = async (walletId: string) => {
    if (walletId === "eternal" || walletId === "lace") {
      if (isAuthenticated) {
        await disconnect();
        showSuccess("Logout Successful", "Your Cardano wallet has been disconnected successfully.");
      } else {
        setConnectingWalletId(walletId);
        showInfo("Connecting...", "Please wait while we connect to your Cardano wallet.");
        try {
          await connect(walletId);
        } finally {
          setConnectingWalletId(null);
        }
      }
    } else if (walletId === "nami") {
      showInfo("Nami Wallet Upgraded", "Nami has been upgraded to Lace! Please use Lace wallet with Nami mode enabled.");
    } else if (walletId === "gero") {
      showInfo("Gero Wallet", "Gero Wallet is currently not supported. Please use Eternl or Lace wallet instead.");
    } else if (walletId === "nufi") {
      showInfo("NuFi Wallet", "NuFi Wallet is currently not supported. Please use Eternl or Lace wallet instead.");
    } else if (walletId === "google") {
      showInfo("Connecting...", "Please wait while we connect to your Google account.");
      await signIn("google", { callbackUrl: "/" });
    } else if (walletId === "github") {
      showInfo("Connecting...", "Please wait while we connect to your GitHub account.");
      await signIn("github", { callbackUrl: "/" });
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

  const isActiveWallet = (walletId: string) => {
    return ["eternal", "lace", "nami", "google", "github"].includes(walletId);
  };

  return (
    <div className="flex-1">
      <div className="space-y-3 h-[280px] overflow-y-auto pr-2">
        {wallets.map((wallet) => {
          const isActive = isActiveWallet(wallet.id);
          
          return (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id)}
                             disabled={(wallet.id === "eternal" || wallet.id === "lace") && connectingWalletId === wallet.id || !isActive}
              className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${
                isActive 
                  ? "border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm bg-white" 
                  : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                             } ${
                 (wallet.id === "eternal" || wallet.id === "lace") && connectingWalletId === wallet.id ? "opacity-50 cursor-not-allowed" : ""
               }`}
            >
              <span className={`text-sm font-medium flex-1 ${
                isActive ? "text-gray-700" : "text-gray-500"
              }`}>
                {wallet.name}
              </span>
              
              {!isActive && (
                <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">
                  BETA
                </span>
              )}
              
                             {wallet.id === "eternal" || wallet.id === "nami" || wallet.id === "typhon" || wallet.id === "lace" || wallet.id === "gero" || wallet.id === "nufi" ? (
                connectingWalletId === wallet.id ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                                     <Image
                     src={`/images/wallets/${wallet.id === "gero" ? "Gero" : wallet.id}.png`}
                     alt={`${wallet.name}`}
                     width={32}
                     height={32}
                     className="w-8 h-8"
                     loading="lazy"
                   />
                )
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
          );
        })}
      </div>
    </div>
  );
} 