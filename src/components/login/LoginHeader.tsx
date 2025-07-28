import Image from "next/image";
import Link from "next/link";
import { images } from "~/public/images";
import { routers } from "~/constants/routers";

export default function LoginHeader() {
  return (
    <div className="flex items-center justify-between mb-16 md:mb-24 w-full max-w-4xl px-4 md:px-0">
      <div className="flex items-center gap-3">
        <Link href={routers.home}>
          <Image
            src={images.logo}
            alt="Cardano2vn"
            className="h-16 md:h-20 w-auto"
            loading="lazy"
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/wallets/google.png"
            alt="Google"
            width={16}
            height={16}
            className="w-4 h-4 md:w-6 md:h-6"
            loading="lazy"
          />
        </div>
        <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/wallets/github.png"
            alt="GitHub"
            width={16}
            height={16}
            className="w-4 h-4 md:w-6 md:h-6"
            loading="lazy"
          />
        </div>
        <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/wallets/telegram.png"
            alt="Telegram"
            width={16}
            height={16}
            className="w-4 h-4 md:w-6 md:h-6"
            loading="lazy"
          />
        </div>
        <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
          <Image
            src="/images/wallets/discord.png"
            alt="Discord"
            width={16}
            height={16}
            className="w-4 h-4 md:w-6 md:h-6"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
} 