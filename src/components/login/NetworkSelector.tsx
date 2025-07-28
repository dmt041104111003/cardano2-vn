import Image from "next/image";
import { images } from "~/public/images";

interface Network {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

interface NetworkSelectorProps {
  networks: Network[];
  selectedNetwork: string;
  onNetworkSelect: (networkId: string) => void;
}

export default function NetworkSelector({ networks, selectedNetwork, onNetworkSelect }: NetworkSelectorProps) {
  return (
    <div className="flex-shrink-0">
      <div className="flex md:flex-col gap-3 md:space-y-3">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onNetworkSelect(network.id)}
            className={`w-14 h-14 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
              selectedNetwork === network.id
                ? "border-blue-500 bg-blue-100 shadow-sm"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
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