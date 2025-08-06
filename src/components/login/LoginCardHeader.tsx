import Image from "next/image";
import { images } from "~/public/images";
import Link from "next/link";
import { Home } from "lucide-react";

export default function LoginCardHeader() {
  return (
    <div className="flex items-center justify-between -mb-2 py-4">
      <Link 
        href="/"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">C2VN</span>
        <div className="flex items-center gap-1">
          <Image
            src={images.loading}
            alt="C2VN"
            width={16}
            height={16}
            className="w-4 h-4"
            loading="lazy"
          />
          <Image
            src="/images/wallets/login.png"
            alt="Social"
            width={16}
            height={16}
            className="w-4 h-4"
            loading="lazy"
          />
          <Image
            src="/images/wallets/phantom.png"
            alt="Phantom"
            width={16}
            height={16}
            className="w-4 h-4"
            loading="lazy"
          />
          <Image
            src="/images/wallets/metamask.png"
            alt="MetaMask"
            width={16}
            height={16}
            className="w-4 h-4"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
} 