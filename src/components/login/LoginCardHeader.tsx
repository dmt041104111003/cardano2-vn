import Image from "next/image";
import { images } from "~/public/images";

export default function LoginCardHeader() {
  return (
    <div className="flex items-center justify-between -mb-2 py-4">
      <Image
        src={images.logo}
        alt="Login"
        width={120}
        height={36}
        className="h-9 w-auto"
        loading="lazy"
      />
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