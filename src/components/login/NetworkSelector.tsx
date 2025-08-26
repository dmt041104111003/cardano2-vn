import Image from "next/image";
import { images } from "~/public/images";
import { NetworkSelectorProps } from '~/constants/login';

export default function NetworkSelector({ networks, selectedNetwork, onNetworkSelect }: NetworkSelectorProps) {
  return (
    <div className="flex-shrink-0">
      <div className="flex flex-col gap-3">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onNetworkSelect(network.id)}
            className={`w-14 h-14 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
              selectedNetwork === network.id
                ? "border-blue-500 bg-blue-100 shadow-sm dark:border-blue-500 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-gray-300 bg-white dark:border-white/10 dark:hover:border-white/20 dark:bg-gray-900"
            }`}
          >
            <div className="text-base">
              {network.id === "c2vn" ? (
                <Image
                  src={images.loading}
                  alt="C2VN"
                  className="w-6 h-6"
                  loading="lazy"
                />
              ) : network.id === "social" ? (
                <Image
                  src="/images/wallets/login.png"
                  alt="Social"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  loading="lazy"
                />
              ) : network.id === "phantom" ? (
                <Image
                  src="/images/wallets/phantom.png"
                  alt="Phantom"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-none"
                  loading="lazy"
                />
              ) : network.id === "metamask" ? (
                <Image
                  src="/images/wallets/metamask.png"
                  alt="MetaMask"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  loading="lazy"
                />
              ) : (
                network.icon
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 